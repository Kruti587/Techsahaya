export function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-card">
      <h2 className="mb-4 text-lg font-semibold text-sahaya-ink">{title}</h2>
      {children}
    </section>
  );
}
