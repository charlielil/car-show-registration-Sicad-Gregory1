# Frontend: commits, Pull Request and submission checklist

The project guide requires **at least 10 meaningful commits made by you, under your own GitHub account**,
on a `frontend` branch, merged through a Pull Request that your partner reviews.

## 1. Setup (once)

```bash
git checkout -b frontend
cd frontend && npm install        # creates package-lock.json (commit it)
```

## 2. Suggested commits (run `git add` + `git commit` in this order)

```bash
git add frontend/package.json frontend/package-lock.json frontend/vite.config.js frontend/index.html frontend/.gitignore frontend/src/main.jsx frontend/src/index.css frontend/src/App.jsx
git commit -m "Scaffold React app with Vite and Tailwind"

git add frontend/.env.development frontend/.env.example
git commit -m "Add API base URL and data-source settings"

git add frontend/src/api/sample-data.js frontend/src/api/http.js
git commit -m "Add sample registration data and API error handling"

git add frontend/src/utils frontend/src/hooks
git commit -m "Add currency/date formatters and useDebounce hook"

git add frontend/src/components/StatusBadge.jsx frontend/src/components/PaymentBadge.jsx frontend/src/components/Icons.jsx
git commit -m "Add status and payment badges"

git add frontend/src/components/KpiCard.jsx frontend/src/components/KpiCards.jsx
git commit -m "Add KPI cards from summary data"

git add frontend/src/components/RegistrationTable.jsx
git commit -m "Add registrations table with status and payment badges"

git add frontend/src/components/RegistrationFilters.jsx
git commit -m "Add participant name search and type/status filters"

git add frontend/src/components/Pagination.jsx
git commit -m "Add pagination and page-size selector"

git add frontend/src/components/StateMessage.jsx frontend/src/pages frontend/src/App.jsx
git commit -m "Add dashboard page with loading, empty and error states"

git add frontend/src/api/registrationsApi.js frontend/src/api/index.js
git commit -m "Connect dashboard to the C# API"

git add frontend/src/components/Modal.jsx frontend/src/components/RegistrationDetailsModal.jsx frontend/src/components/NewRegistrationModal.jsx frontend/src/components/Header.jsx
git commit -m "Add New Registration form and details modal (bonus)"

git add backend/Api/Program.cs README.md frontend/README.md docs
git commit -m "Allow 127.0.0.1 in CORS and document how to run both apps"
```

(If a `git add` complains that a path is already committed, just skip it.)
Then `git push -u origin frontend`, open a **Pull Request** into `main` on GitHub, ask your partner to review and merge.
Do not commit `node_modules/` or `dist/` (already in `.gitignore`).

## 3. Screenshots to take (save in `docs/screenshots/`, same names as in the Google Doc)

| # | File name | What |
| - | --- | --- |
| 1 | `01-frontend-src-structure.png` | `frontend/src` folder (components, pages, api) |
| 2 | `02-dashboard-full.png` | KPI cards + table + pagination with real API data |
| 3 | `03-loading-state.png` | "Loading registrations…" / skeleton rows (DevTools → Network → throttle "Slow 4G", then reload) |
| 4 | `04-search-filtered.png` | type a name, e.g. `cruz` |
| 5 | `05a-filter-type.png`, `05b-filter-status.png` | type = VIP, then status = CheckedIn |
| 6 | `06-paging-page2.png` | page 2 with "Showing 11–20 of 25" |
| 7 | `07-empty-state.png` | search `zzzz` |
| 8 | `08-error-state.png` | stop the API, click Try again |
| 9 | `09-devtools-network.png` | Network tab: `GET /api/registrations?...` + JSON response |
| 10 | `10-github-commits.png` | GitHub commit history |
| 11 | `11-running-app.png` | Scalar/terminal and the React app side by side |

## 4. Google Doc

Name `CarShow-Frontend-Documentation-<Surname>`; share with vhinle@gmail.com as Commenter and "Anyone with the link: Viewer".
Cover page, table of contents, Heading 1 "Screenshots" / "Reflection Answers", Heading 2 per screenshot and question.
Each screenshot needs a 3–5 sentence explanation and each reflection answer 5+ sentences with an example from the project,
**in your own words** — the guide requires this, so write these yourself from what you saw while running the app.
