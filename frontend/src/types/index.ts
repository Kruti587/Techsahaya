export type Role = "citizen" | "csc_operator" | "admin";

export type Scheme = {
  id: string;
  name: string;
  description: string;
  category: string;
  state_scope: string[];
  benefits: string[];
  eligibility: string[];
  required_documents: string[];
  application_steps: string[];
  department: string;
  official_link: string;
  source_name: string;
  source_reference: string;
  last_verified: string;
  alternative_scheme_ids: string[];
  data_note?: string;
};

export type EligibilityProfile = {
  age?: number;
  gender?: string;
  state?: string;
  occupation?: string;
  income?: number;
  landholding?: number;
  disability?: boolean;
  family_members?: Record<string, unknown>[];
  available_documents: string[];
};

export type User = {
  id: string;
  full_name: string;
  email: string;
  preferred_language: string;
  role: Role;
  auth_adapter?: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  level: string;
  read: boolean;
  created_at: string;
};
