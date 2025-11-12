export default function ErrorPanel({ title, details }: { title: string; details?: string }) {
  return (
    <div className="mx-auto my-12 max-w-xl rounded-lg border border-red-200 bg-red-50 p-4">
      <h2 className="text-red-700 font-semibold mb-2">{title}</h2>
      {details && (
        <pre className="whitespace-pre-wrap text-xs text-red-800">{details}</pre>
      )}
      <div className="mt-3 text-sm text-red-700">
        Quick checklist:
        <ul className="list-disc pl-5 mt-1">
          <li>Vercel → Project → <b>Environment Variables</b></li>
          <li>Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
          <li>Redeploy the project after saving vars</li>
        </ul>
      </div>
    </div>
  );
}
