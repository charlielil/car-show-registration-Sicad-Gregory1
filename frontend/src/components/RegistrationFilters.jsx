import { IconSearch, IconX } from "./Icons.jsx";

const TYPES = ["Exhibitor", "Competitor", "VIP"];
const STATUSES = [
  { value: "Pending", label: "Pending" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "CheckedIn", label: "Checked In" },
  { value: "Cancelled", label: "Cancelled" },
];

const fieldClasses =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 hover:border-slate-400";

/** Search + type + status + clear. Fully controlled: the page owns the values. */
export default function RegistrationFilters({ search, type, status, onSearchChange, onTypeChange, onStatusChange, onClear, hasActiveFilters }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end">
      <div className="md:w-72">
        <label htmlFor="filter-search" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
          Participant name
        </label>
        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="filter-search"
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search participant name…"
            className={`${fieldClasses} pl-9`}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="md:w-44">
        <label htmlFor="filter-type" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
          Type
        </label>
        <select id="filter-type" value={type} onChange={(e) => onTypeChange(e.target.value)} className={fieldClasses}>
          <option value="">All types</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="md:w-44">
        <label htmlFor="filter-status" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">
          Status
        </label>
        <select id="filter-status" value={status} onChange={(e) => onStatusChange(e.target.value)} className={fieldClasses}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onClear}
        disabled={!hasActiveFilters}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
      >
        <IconX className="h-4 w-4" />
        Clear filters
      </button>
    </div>
  );
}
