import StatusBadge from "./StatusBadge.jsx";
import PaymentBadge from "./PaymentBadge.jsx";
import { formatCurrency, formatDate } from "../utils/format.js";

const COLUMNS = [
  { label: "Reg. No.", align: "left" },
  { label: "Date", align: "left" },
  { label: "Participant", align: "left" },
  { label: "Car", align: "left" },
  { label: "Type", align: "left" },
  { label: "Status", align: "left" },
  { label: "Fee / Paid", align: "right" },
  { label: "Payment", align: "left" },
];

function SkeletonRows({ count }) {
  return Array.from({ length: count }, (_, i) => (
    <tr key={i} className="animate-pulse border-t border-slate-100" aria-hidden="true">
      {COLUMNS.map((c) => (
        <td key={c.label} className="px-4 py-4">
          <div className={`h-4 rounded bg-slate-200 ${c.label === "Participant" || c.label === "Car" ? "w-36" : "w-20"} ${c.align === "right" ? "ml-auto" : ""}`} />
          {(c.label === "Participant" || c.label === "Car" || c.label === "Date") && <div className="mt-2 h-3 w-24 rounded bg-slate-100" />}
        </td>
      ))}
    </tr>
  ));
}

/** The registrations table. Scrolls sideways on small screens instead of breaking the layout. */
export default function RegistrationTable({ items, loading, skeletonRows = 10, onSelect }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[960px] text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
          <tr>
            {COLUMNS.map((c) => (
              <th key={c.label} scope="col" className={`px-4 py-3 ${c.align === "right" ? "text-right" : "text-left"}`}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <SkeletonRows count={skeletonRows} />
          ) : (
            items.map((r) => (
              <tr key={r.id} className="border-t border-slate-100 hover:bg-indigo-50/40">
                <td className="whitespace-nowrap px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelect(r)}
                    className="rounded font-mono text-sm font-semibold text-indigo-700 underline-offset-2 hover:underline"
                    title="View details"
                  >
                    {r.registrationNumber}
                  </button>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">{formatDate(r.registrationDate)}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{r.participantName}</div>
                  <div className="text-xs text-slate-500">{r.contactNumber}</div>
                  <div className="text-xs text-slate-500">{r.email}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-slate-900">{r.carMakeModel}</div>
                  <div className="font-mono text-xs text-slate-500">{r.plateNumber}</div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">{r.registrationType}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-700">
                  {formatCurrency(r.registrationFee)} / <span className="font-semibold text-slate-900">{formatCurrency(r.amountPaid)}</span>
                </td>
                <td className="px-4 py-3">
                  <PaymentBadge status={r.paymentStatus} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
