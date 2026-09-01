export function SecurityPage() {
  const checks = [
    "Consent-first data collection",
    "Data minimization",
    "No raw Aadhaar storage",
    "No biometric storage",
    "In-memory document processing",
    "Role-based access",
    "Encrypted transport",
    "Secure document storage architecture",
    "User-controlled deletion",
    "Audit logging",
    "No third-party advertising or analytics"
  ];
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <h1 className="text-4xl font-bold">Security & Privacy</h1>
      <p className="mt-4 text-slate-600">Privacy by Design. Tech Sahaya is designed to align with DPDP Act principles and minimize exposure of sensitive citizen data.</p>
      <div className="grid gap-3 md:grid-cols-2">
        {checks.map((item) => <div key={item} className="rounded-2xl border bg-white p-4">{item}</div>)}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <section className="rounded-2xl border bg-white p-5 shadow-card">
          <h2 className="font-semibold text-sahaya-green">What we collect</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Minimum self-declared information such as age band, income band, occupation, state, language preference, and document type metadata.</p>
        </section>
        <section className="rounded-2xl border bg-white p-5 shadow-card">
          <h2 className="font-semibold text-sahaya-green">What we never collect</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Full Aadhaar number, biometric data, bank account or payment details, and unnecessary permanent address details.</p>
        </section>
        <section className="rounded-2xl border bg-white p-5 shadow-card">
          <h2 className="font-semibold text-sahaya-green">Your controls</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Consent is explicit, withdrawable, and tied to purpose. Profile and document metadata can be deleted from the Privacy Center.</p>
        </section>
      </div>
    </div>
  );
}
