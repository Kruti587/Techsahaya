import { Link } from "react-router-dom";

export function AccessRestrictedPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-4xl font-bold">Access Restricted</h1>
      <p className="mt-4 text-slate-600">You do not have permission to view this page. Return to a page that matches your role.</p>
      <Link to="/" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-sahaya-green px-5 text-white">Go Home</Link>
    </div>
  );
}
