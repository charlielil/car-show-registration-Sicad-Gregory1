import { useCallback, useEffect, useState } from "react";
import { USING_SAMPLE_DATA, getRegistrations, getSummary } from "../api";
import { useDebounce } from "../hooks/useDebounce.js";
import Header from "../components/Header.jsx";
import KpiCards from "../components/KpiCards.jsx";
import RegistrationFilters from "../components/RegistrationFilters.jsx";
import RegistrationTable from "../components/RegistrationTable.jsx";
import Pagination from "../components/Pagination.jsx";
import StateMessage from "../components/StateMessage.jsx";
import RegistrationDetailsModal from "../components/RegistrationDetailsModal.jsx";
import NewRegistrationModal from "../components/NewRegistrationModal.jsx";
import { IconInbox, IconRefresh, IconWifiOff } from "../components/Icons.jsx";

/**
 * Owns ALL the dashboard state (filters, page, data, loading, error) so that the
 * child components stay simple: they only receive values and callbacks as props.
 */
export default function RegistrationsPage() {
  // ---- filters ----
  const [search, setSearch] = useState(""); // what is typed in the box
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const debouncedSearch = useDebounce(search, 400); // what is sent to the API

  // ---- page: automatically goes back to 1 whenever a filter or the page size changes ----
  const filterKey = `${debouncedSearch.trim()}|${type}|${status}|${pageSize}`;
  const [pageState, setPageState] = useState({ key: filterKey, page: 1 });
  const page = pageState.key === filterKey ? pageState.page : 1;
  const setPage = (p) => setPageState({ key: filterKey, page: p });

  // ---- list data ----
  const [data, setData] = useState(null); // { items, page, pageSize, totalCount, totalPages }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---- KPI summary ----
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(null);

  // ---- misc ----
  const [reloadKey, setReloadKey] = useState(0); // bump to re-run both fetches
  const [selected, setSelected] = useState(null); // row shown in the details modal
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState("");

  // Fetch the table page whenever a filter, the page or the page size changes.
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getRegistrations(
      { participantName: debouncedSearch.trim(), type, status, page, pageSize },
      { signal: controller.signal },
    )
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return; // a newer request replaced this one
        setError(err);
        setLoading(false);
      });

    return () => controller.abort(); // ignore stale responses
  }, [debouncedSearch, type, status, page, pageSize, reloadKey]);

  // Fetch the KPI numbers (independent of filters and paging).
  useEffect(() => {
    const controller = new AbortController();
    setSummaryLoading(true);
    setSummaryError(null);

    getSummary({ signal: controller.signal })
      .then((result) => {
        setSummary(result);
        setSummaryLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setSummaryError(err);
        setSummaryLoading(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  // Hide the success message after a few seconds.
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  const hasActiveFilters = search !== "" || type !== "" || status !== "";
  const clearFilters = useCallback(() => {
    setSearch("");
    setType("");
    setStatus("");
  }, []);
  const retry = () => setReloadKey((k) => k + 1);

  function handleCreated(created) {
    setShowForm(false);
    clearFilters(); // so the new (newest) registration is visible on page 1
    setReloadKey((k) => k + 1);
    setToast(`Registration ${created.registrationNumber} for ${created.participantName} was created.`);
  }

  const items = data?.items ?? [];
  const showSkeleton = loading;
  const showError = !loading && error;
  const showEmpty = !loading && !error && data && data.totalCount === 0;

  return (
    <div className="min-h-screen bg-slate-100 pb-10">
      <Header usingSampleData={USING_SAMPLE_DATA} onNewRegistration={() => setShowForm(true)} />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        {toast && (
          <div role="status" className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            {toast}
          </div>
        )}

        {/* 1. KPI cards */}
        <KpiCards summary={summary} loading={summaryLoading} error={summaryError} onRetry={retry} />

        {/* 2. Filters + table + paging */}
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm" aria-label="Registrations">
          <div className="space-y-4 border-b border-slate-200 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Registrations</h2>
              {loading && (
                <p role="status" className="text-sm font-medium text-indigo-700">
                  Loading registrations…
                </p>
              )}
            </div>
            <RegistrationFilters
              search={search}
              type={type}
              status={status}
              onSearchChange={setSearch}
              onTypeChange={setType}
              onStatusChange={setStatus}
              onClear={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {showError ? (
            <StateMessage
              tone="error"
              icon={<IconWifiOff className="h-6 w-6" />}
              title="Cannot reach the API…"
              actionLabel="Try again"
              onAction={retry}
            >
              {error.message}
            </StateMessage>
          ) : showEmpty ? (
            <StateMessage
              icon={<IconInbox className="h-6 w-6" />}
              title={hasActiveFilters ? "No registrations match your filters" : "No registrations yet"}
              actionLabel={hasActiveFilters ? "Clear filters" : "New registration"}
              onAction={hasActiveFilters ? clearFilters : () => setShowForm(true)}
            >
              {hasActiveFilters ? "Try a different name, type or status." : "Add the first participant to get started."}
            </StateMessage>
          ) : (
            <>
              <RegistrationTable items={items} loading={showSkeleton} skeletonRows={pageSize} onSelect={setSelected} />
              <Pagination
                page={page}
                pageSize={pageSize}
                totalCount={data?.totalCount ?? 0}
                totalPages={data?.totalPages ?? 1}
                loading={loading}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </>
          )}
        </section>

        {showError && (
          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <IconRefresh className="h-3.5 w-3.5" />
            Start the backend with <code className="rounded bg-slate-200 px-1">dotnet run --project Api</code> and press Try again.
          </p>
        )}
      </main>

      {selected && <RegistrationDetailsModal registration={selected} onClose={() => setSelected(null)} />}
      {showForm && <NewRegistrationModal onClose={() => setShowForm(false)} onCreated={handleCreated} />}
    </div>
  );
}
