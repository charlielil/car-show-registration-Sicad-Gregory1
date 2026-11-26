const STYLES = {
  Pending: { label: "Pending", classes: "bg-white text-slate-700 ring-slate-400", dot: "bg-slate-400" },
  Confirmed: { label: "Confirmed", classes: "bg-sky-50 text-sky-800 ring-sky-300", dot: "bg-sky-500" },
  CheckedIn: { label: "Checked In", classes: "bg-violet-50 text-violet-800 ring-violet-300", dot: "bg-violet-500" },
  Cancelled: { label: "Cancelled", classes: "bg-slate-200 text-slate-700 ring-slate-300", dot: "bg-slate-600" },
};

/** Registration status: Pending / Confirmed / CheckedIn / Cancelled */
export default function StatusBadge({ status }) {
  const style = STYLES[status] ?? { label: status, classes: "bg-slate-100 text-slate-700 ring-slate-300", dot: "bg-slate-400" };
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${style.classes}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {style.label}
    </span>
  );
}
