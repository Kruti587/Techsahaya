export function HowItWorksPage() {
  const journey = ["Discover", "Understand", "Verify", "Prepare", "Apply", "Track"];
  const layers = [
    { title: "Scheme DNA Decomposition", body: "Schemes are split into source, benefit, document, and eligibility-rule pieces so guidance is explainable." },
    { title: "Conversational Eligibility Graph", body: "Citizens see what matched, what failed, and what information is missing before they apply." },
    { title: "Zero-Literacy Voice Interface", body: "Citizens can speak questions, read transcripts, and hear answers when browser support is available." }
  ];
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <h1 className="text-4xl font-bold">How Tech Sahaya Works</h1>
      <div className="space-y-4 text-slate-600">
        <p>Tech Sahaya is built around a simple citizen journey: discover, understand, verify, prepare, apply, and track.</p>
        <p>AI helps with conversation and explanation. Deterministic rules handle eligibility. Evidence and source metadata build trust. Secure access controls protect citizen data.</p>
      </div>
      <section className="grid gap-3 md:grid-cols-6">
        {journey.map((step, index) => (
          <div key={step} className="rounded-2xl border bg-white p-4 text-center shadow-card">
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-sahaya-green text-sm font-bold text-white">{index + 1}</div>
            <div className="font-semibold">{step}</div>
          </div>
        ))}
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {layers.map((layer) => (
          <div key={layer.title} className="rounded-2xl border bg-white p-5 shadow-card">
            <h2 className="font-semibold text-sahaya-green">{layer.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{layer.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
