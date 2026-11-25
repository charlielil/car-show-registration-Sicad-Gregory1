const STYLES = {
  Unpaid: { classes: "bg-red-50 text-red-800 ring-red-300", dot: "bg-red-600" },
  Partial: { classes: "bg-amber-50 text-amber-800 ring-amber-300", dot: "bg-amber-500" },
  Paid: { classes: "bg-green-50 text-green-800 ring-green-300", dot: "bg-green-600" },
};

/** Computed payment status: Unpaid (red) / Partial (amber) / Paid (green). The text is always shown. */
export default function PaymentBadge({ status }) {
  const style = STYLES[status] ?? { classes: "bg-slate-100 text-slate-700 ring-slate-300", dot: "bg-slate-400" };
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${style.classes}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {status}
    </span>
  );
}
