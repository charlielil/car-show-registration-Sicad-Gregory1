import KpiCard from "./KpiCard.jsx";
import {
  IconAlertCircle,
  IconCheck,
  IconCheckCircle,
  IconClock,
  IconLogIn,
  IconPercent,
  IconUsers,
} from "./Icons.jsx";
import { formatCurrency, formatNumber, formatPercent } from "../utils/format.js";

/**
 * The KPI row. Every number comes from GET /api/registrations/summary,
 * never from adding up the rows that are on screen.
 */
export default function KpiCards({ summary, loading, error, onRetry }) {
  if (error && !summary) {
    return (
      <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        <span>
          <strong className="font-semibold">Could not load the totals.</strong> {error.message}
        </span>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-red-700 px-3 py-1.5 font-semibold text-white hover:bg-red-800"
        >
          Try again
        </button>
      </div>
    );
  }

  // While the summary has not arrived yet, show grey placeholder cards.
  const s = summary;
  const v = (fn) => (s ? fn(s) : null);
  const collectionRate = s && s.totalFees > 0 ? (s.totalPayments / s.totalFees) * 100 : 0;

  return (
    <section aria-label="Key numbers" aria-busy={loading && !s}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          title="Total Registrations"
          value={v((x) => formatNumber(x.totalRegistrations))}
          hint="All participants"
          icon={<IconUsers />}
          highlight
        />
        <KpiCard
          title="Total Payments"
          value={v((x) => formatCurrency(x.totalPayments))}
          hint="Collected so far"
          icon={<IconCheckCircle />}
          iconClasses="bg-green-50 text-green-700"
        />
        <KpiCard
          title="Uncollected Payments"
          value={v((x) => formatCurrency(x.uncollectedPayments))}
          hint="Still to be paid"
          icon={<IconAlertCircle />}
          iconClasses="bg-red-50 text-red-700"
        />
        <KpiCard
          title="Confirmed"
          value={v((x) => formatNumber(x.confirmed))}
          hint="Ready for the event"
          icon={<IconCheck />}
          iconClasses="bg-sky-50 text-sky-700"
        />
        <KpiCard
          title="Checked In"
          value={v((x) => formatNumber(x.checkedIn))}
          hint="Arrived at the venue"
          icon={<IconLogIn />}
          iconClasses="bg-violet-50 text-violet-700"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <KpiCard
          title="Pending / Cancelled"
          value={v((x) => `${formatNumber(x.pending)} / ${formatNumber(x.cancelled)}`)}
          hint="Waiting for confirmation / cancelled"
          icon={<IconClock />}
          iconClasses="bg-slate-100 text-slate-700"
        />
        <KpiCard
          title="Collection Rate"
          value={v((x) => formatPercent(x.totalPayments, x.totalFees))}
          hint={s ? `${formatCurrency(s.totalPayments)} of ${formatCurrency(s.totalFees)} in fees` : undefined}
          icon={<IconPercent />}
          iconClasses="bg-amber-50 text-amber-700"
        >
          <div
            className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200"
            role="progressbar"
            aria-label="Collection rate"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(collectionRate)}
          >
            <div className="h-full rounded-full bg-green-600" style={{ width: `${Math.min(collectionRate, 100)}%` }} />
          </div>
        </KpiCard>
      </div>
    </section>
  );
}
