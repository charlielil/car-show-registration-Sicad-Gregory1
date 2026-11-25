/**
 * One KPI card. Pass `value = null` to show a grey placeholder (skeleton) while loading.
 * `children` is optional extra content under the value (e.g. a progress bar).
 */
export default function KpiCard({ title, value, hint, icon, iconClasses = "bg-indigo-50 text-indigo-700", highlight = false, children }) {
  return (
    <div
      className={`rounded-xl border bg-white p-4 shadow-sm ${
        highlight ? "border-indigo-300 ring-1 ring-indigo-200" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClasses}`}>{icon}</span>
      </div>

      {value === null ? (
        <div className="mt-3 space-y-2 animate-pulse" aria-hidden="true">
          <div className="h-8 w-2/3 rounded bg-slate-200" />
          <div className="h-3 w-1/2 rounded bg-slate-100" />
        </div>
      ) : (
        <>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 tabular-nums">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
          {children}
        </>
      )}
    </div>
  );
}
