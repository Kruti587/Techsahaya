import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SectionCard } from "../components/SectionCard";
import { api } from "../services/api";

export function SchemeDetailsPage() {
  const { schemeId } = useParams();
  const [data, setData] = useState<any | null>(null);
  useEffect(() => {
    api.get(`/api/schemes/${schemeId}`).then((res) => setData(res.data)).catch(() => setData(null));
  }, [schemeId]);
  if (!data) return <p>Loading scheme details...</p>;
  const scheme = data.scheme;
  return (
    <div className="space-y-4">
      <SectionCard title={scheme.name}>
        <p>{scheme.description}</p>
        <p className="mt-2 text-sm">Category: {scheme.category} | State applicability: {scheme.state_scope.join(", ")}</p>
        <p className="text-sm">Verification status: Last verified on {scheme.last_verified}</p>
        <p className="text-sm">Department: {scheme.department}</p>
        {data.conflicts.length > 0 && <div className="mt-4 rounded-xl bg-amber-100 p-3 text-amber-900">{data.conflicts[0]}</div>}
        <div className="mt-4 flex gap-3">
          <Link to="/eligibility" className="inline-flex min-h-12 items-center rounded-xl bg-sahaya-green px-4 text-white">Check My Eligibility</Link>
          <button onClick={() => api.post("/api/schemes/save", { scheme_id: scheme.id })} className="inline-flex min-h-12 items-center rounded-xl border px-4">Save Scheme</button>
          <a href={scheme.official_link} target="_blank" className="inline-flex min-h-12 items-center rounded-xl border px-4" rel="noreferrer">Official source</a>
        </div>
      </SectionCard>
      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title="Benefits">{scheme.benefits.map((item: string) => <div key={item}>{item}</div>)}</SectionCard>
        <SectionCard title="Eligibility">{scheme.eligibility.map((item: string) => <div key={item}>{item}</div>)}</SectionCard>
        <SectionCard title="Required documents">{scheme.required_documents.map((item: string) => <div key={item}>{item}</div>)}</SectionCard>
        <SectionCard title="Application steps">{scheme.application_steps.map((item: string) => <div key={item}>{item}</div>)}</SectionCard>
        <SectionCard title="Evidence"><div>Scheme: {scheme.name}</div><div>Source: {scheme.source_name}</div><div>Last Verified: {scheme.last_verified}</div><div>Evidence: {scheme.source_reference}</div></SectionCard>
        <SectionCard title="Alternatives">{scheme.alternative_scheme_ids.map((item: string) => <div key={item}>{item}</div>)}</SectionCard>
      </div>
    </div>
  );
}
