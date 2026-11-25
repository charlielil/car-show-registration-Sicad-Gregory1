import { IconChevronLeft, IconChevronRight } from "./Icons.jsx";

export const PAGE_SIZES = [5, 10, 20];

/** 1 … 4 5 6 … 12 */
function pageList(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const result = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push("gap");
    result.push(p);
  });
  return result;
}

const baseButton =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-semibold shadow-sm";
const idleButton = "border-slate-300 bg-white text-slate-700 hover:bg-slate-50";
const disabledButton = "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white";

/** Prev / numbered pages / Next, a "Showing x–y of N" summary and a page-size selector. */
export default function Pagination({ page, pageSize, totalCount, totalPages, loading, onPageChange, onPageSizeChange }) {
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 md:flex-row md:items-center md:justify-between">
      <nav aria-label="Pagination" className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={loading || page <= 1}
          className={`${baseButton} ${idleButton} ${disabledButton} gap-1 pr-3`}
          aria-label="Previous page"
        >
          <IconChevronLeft className="h-4 w-4" />
          Prev
        </button>

        {pageList(page, totalPages).map((p, i) =>
          p === "gap" ? (
            <span key={`gap-${i}`} className="px-1 text-slate-400" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              disabled={loading}
              aria-current={p === page ? "page" : undefined}
              aria-label={`Page ${p}`}
              className={`${baseButton} ${disabledButton} ${
                p === page ? "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-600" : idleButton
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={loading || page >= totalPages}
          className={`${baseButton} ${idleButton} ${disabledButton} gap-1 pl-3`}
          aria-label="Next page"
        >
          Next
          <IconChevronRight className="h-4 w-4" />
        </button>
      </nav>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
        <span aria-live="polite">
          Showing <strong className="text-slate-900">{start}–{end}</strong> of <strong className="text-slate-900">{totalCount}</strong>
        </span>
        <label className="flex items-center gap-2">
          <span>Per page</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            disabled={loading}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 shadow-sm hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
