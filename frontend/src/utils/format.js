const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});
const numberFormatter = new Intl.NumberFormat("en-PH");

/** 2500 -> "₱2,500.00" */
export function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0);
}

/** 1234 -> "1,234" */
export function formatNumber(value) {
  return numberFormatter.format(Number(value) || 0);
}

/** 42000, 61500 -> "68.3%" (0 when there is nothing to collect) */
export function formatPercent(part, total) {
  if (!total) return "0.0%";
  return `${((part / total) * 100).toFixed(1)}%`;
}

/**
 * The API sends UTC dates. SQLite can return them without the trailing "Z",
 * which the browser would read as *local* time, so add it when it is missing.
 */
export function parseApiDate(value) {
  if (!value) return null;
  const text = String(value);
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/i.test(text);
  const date = new Date(hasZone ? text : `${text}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "2027-02-10T08:30:00Z" -> "Feb 10, 2027 08:30 AM" (in the viewer's time zone) */
export function formatDate(value) {
  const date = parseApiDate(value);
  if (!date) return "—";
  const day = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${day} ${time}`;
}
