-- Tech Sahaya Supabase reference schema and RLS policies.
-- Apply only after reviewing table names and migration strategy for the target Supabase project.

create table if not exists public.roles (
  name text primary key,
  description text default ''
);

create table if not exists public.user_roles (
  user_id uuid references auth.users(id) on delete cascade,
  role_name text references public.roles(name),
  primary key (user_id, role_name)
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  preferred_language text default 'en',
  accessibility_preference text default 'standard',
  consent_given boolean default false,
  age integer,
  gender text,
  state text,
  occupation text,
  income numeric,
  landholding numeric,
  disability boolean default false,
  family_members jsonb default '[]'::jsonb,
  available_documents jsonb default '[]'::jsonb,
  recently_viewed_schemes jsonb default '[]'::jsonb,
  digital_literacy text default 'guided',
  updated_at timestamptz default now()
);

create table if not exists public.schemes (
  id text primary key,
  name text not null,
  description text not null,
  category_id text,
  state_id text,
  benefits jsonb default '[]'::jsonb,
  eligibility jsonb default '[]'::jsonb,
  application_steps jsonb default '[]'::jsonb,
  department text,
  status text default 'active',
  alternative_scheme_ids jsonb default '[]'::jsonb,
  last_verified date
);

create table if not exists public.scheme_rules (
  id uuid primary key default gen_random_uuid(),
  scheme_id text references public.schemes(id) on delete cascade,
  rule_json jsonb not null,
  version text default 'v1',
  status text default 'active'
);

create table if not exists public.scheme_sources (
  id uuid primary key default gen_random_uuid(),
  scheme_id text references public.schemes(id) on delete cascade,
  source_name text not null,
  source_url text not null,
  source_reference text,
  last_verified date,
  verification_status text default 'needs_review'
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  document_type text not null,
  status text default 'processed',
  verification_state text default 'processed',
  masked_fields jsonb default '{}'::jsonb,
  storage_path text,
  retained_in_storage boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.authorized_sessions (
  id uuid primary key default gen_random_uuid(),
  citizen_user_id uuid references auth.users(id) on delete cascade,
  operator_user_id uuid references auth.users(id) on delete cascade,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  actor_role text not null,
  event_type text not null,
  target_resource text,
  detail text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.authorized_sessions enable row level security;
alter table public.audit_logs enable row level security;
alter table public.schemes enable row level security;
alter table public.scheme_rules enable row level security;
alter table public.scheme_sources enable row level security;

create policy "citizens read own profile" on public.profiles
  for select using (auth.uid() = user_id);

create policy "citizens update own profile" on public.profiles
  for update using (auth.uid() = user_id);

create policy "citizens read own documents" on public.documents
  for select using (auth.uid() = user_id);

create policy "citizens delete own documents" on public.documents
  for delete using (auth.uid() = user_id);

create policy "csc active session document access" on public.documents
  for select using (
    exists (
      select 1 from public.authorized_sessions s
      where s.citizen_user_id = documents.user_id
        and s.operator_user_id = auth.uid()
        and s.active = true
    )
  );

create policy "public active schemes" on public.schemes
  for select using (status = 'active');

create policy "admins manage schemes" on public.schemes
  for all using (
    exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role_name = 'ADMIN')
  );

create policy "admins manage rules" on public.scheme_rules
  for all using (
    exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role_name = 'ADMIN')
  );

create policy "admins view audit" on public.audit_logs
  for select using (
    exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role_name = 'ADMIN')
  );

create policy "citizens view own audit" on public.audit_logs
  for select using (auth.uid() = user_id);
