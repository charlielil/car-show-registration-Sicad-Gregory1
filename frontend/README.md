# Car Show 2027 — Registration Dashboard (React + Vite + Tailwind CSS)

Dashboard used by event staff to see how the event is doing (KPI cards) and to browse, search and filter registrations.
It talks to the C# API in `../backend`.

## Run it

```bash
# 1. backend (terminal 1)
cd backend
dotnet run --project Api          # http://localhost:5205  (Scalar docs: /scalar/v1)

# 2. frontend (terminal 2)
cd frontend
npm install
npm run dev                       # http://localhost:5173
```

Requires Node.js 20.19+ (or 22+). The API only allows the origin `http://localhost:5173` (or `127.0.0.1:5173`),
so `vite.config.js` uses `strictPort`: if 5173 is busy, Vite stops instead of choosing another port.

## Configuration (`.env.development`)

| Variable | Meaning |
| --- | --- |
| `VITE_API_BASE_URL` | URL of the C# API, e.g. `http://localhost:5205` |
| `VITE_USE_SAMPLE_DATA` | `false` = real API, `true` = local sample data |

Restart `npm run dev` after changing an `.env` file.

## Switching between sample data and the real API

`src/api/` has two files with the **same function names and return shapes**:

| File | Used when |
| --- | --- |
| `registrationsApi.js` | real `fetch` calls to the C# API |
| `sample-data.js` | 26 sample registrations, filtered/paged/totalled in the browser (no backend needed) |

`src/api/index.js` is the only place that chooses between them. Components always `import { getRegistrations } from "../api"`.

- **Sample data:** set `VITE_USE_SAMPLE_DATA=true` in `.env.development` and restart. A yellow "Sample data mode" badge appears in the header.
- **Real API:** set `VITE_USE_SAMPLE_DATA=false` (default), start the backend, restart.

(Equivalent manual way: in `src/api/index.js`, change which module is assigned to `source`.)

## Project structure

```
src/
  api/
    http.js                 fetch wrapper, ApiError, ProblemDetails -> field errors
    registrationsApi.js     real API: getRegistrations, getSummary, getRegistrationById, createRegistration
    sample-data.js          same functions on local data
    index.js                picks real or sample
  hooks/useDebounce.js      waits 400 ms after the user stops typing
  utils/format.js           ₱ currency, dates, percent
  components/
    KpiCard.jsx, KpiCards.jsx          5 required + 2 optional cards (from /summary)
    RegistrationFilters.jsx            search, type, status, Clear filters
    RegistrationTable.jsx              table + skeleton rows
    Pagination.jsx                     Prev/Next, page numbers, "Showing x–y of N", page size
    StatusBadge.jsx, PaymentBadge.jsx  colored badges (text always shown)
    StateMessage.jsx                   empty + error panels
    Modal.jsx, RegistrationDetailsModal.jsx, NewRegistrationModal.jsx   (bonus)
  pages/RegistrationsPage.jsx          owns all state + data fetching
```

## Where state lives

`RegistrationsPage` owns the filters, page, page size, list data, summary, loading and error state.
Child components are controlled: they receive values and callbacks as props. The page automatically returns to
page 1 whenever a filter or the page size changes, and stale responses are cancelled with `AbortController`.

## Features

- KPI cards from `GET /api/registrations/summary` (never from the rows on screen) + collection rate
- Table with colored status and payment badges, ₱ amounts right-aligned, formatted dates
- Filtering and paging by the API (`participantName`, `type`, `status`, `page`, `pageSize`); 400 ms debounced search
- Loading (text + skeleton rows/cards), empty ("No registrations match your filters" + Clear filters) and error ("Cannot reach the API…" + Try again) states
- Bonus: New Registration form (`POST`, shows 400 and 409 errors next to the right fields), details modal (`GET /{id}`), skeleton loading
