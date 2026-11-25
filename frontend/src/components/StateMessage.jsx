/** Shared panel for the empty and error states (icon + title + text + one action button). */
export default function StateMessage({ icon, title, children, actionLabel, onAction, tone = "neutral" }) {
  const iconTone = tone === "error" ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600";
  return (
    <div role={tone === "error" ? "alert" : "status"} className="flex flex-col items-center px-6 py-14 text-center">
      <span className={`flex h-12 w-12 items-center justify-center rounded-full ${iconTone}`}>{icon}</span>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      {children && <p className="mt-1 max-w-md text-sm text-slate-600">{children}</p>}
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
