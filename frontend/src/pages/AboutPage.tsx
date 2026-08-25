export function AboutPage() {
  const groups = ["Rural and semi-urban citizens", "Senior citizens", "Women", "Students", "Farmers", "Differently-abled citizens", "CSC operators"];
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <h1 className="text-4xl font-bold">About Tech Sahaya</h1>
      <p className="mt-4 text-slate-600">Tech Sahaya is a digital citizen assistant focused on helping people navigate welfare schemes with clarity, evidence, and privacy-first design. It is built as a serious civic-tech platform for future integration with public digital infrastructure.</p>
      <section className="rounded-3xl border bg-white p-6 shadow-card">
        <h2 className="text-xl font-semibold">Who Tech Sahaya is for</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {groups.map((group) => <span key={group} className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-sahaya-green">{group}</span>)}
        </div>
      </section>
      <section className="rounded-3xl border bg-white p-6 shadow-card">
        <h2 className="text-xl font-semibold">Where it fits</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Tech Sahaya does not replace official portals. It sits in front of myScheme, UMANG, and CSC-assisted workflows as a voice-and-plain-language navigation layer, then hands citizens to official links for final application.</p>
      </section>
    </div>
  );
}
