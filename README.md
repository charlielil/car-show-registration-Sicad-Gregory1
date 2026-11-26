# Car Show Registration System — Car Show 2027

Course: Integrative Programming 2 (API Backend Development) — CCDI Sorsogon Campus

## Team

| MEMBER | ROLE |
| ------ | ---- |
| Charlie Sicad | Backend Developer |
| Angelica Gregory | Frontend Developer |

## Repository layout

```
car-show-registration/
├── backend/   C# / .NET 10 Vertical Slice API (EF Core + SQLite)
├── frontend/  React (Vite) dashboard
├── docs/screenshots/
└── README.md
```

## Run the backend

Requirements: .NET 10 SDK and the EF Core tool (`dotnet tool install --global dotnet-ef`).

```bash
cd backend

# one time only: create the InitialCreate migration (committed to the repo)
dotnet ef migrations add InitialCreate --project Infrastructure --startup-project Api --output-dir Persistence/Migrations

dotnet run --project Api
```

On start-up the API applies migrations to `carshow.db` (SQLite file, created in `backend/Api`)
and seeds 25 registrations if the table is empty. Restarting does not seed again.

- API: http://localhost:5205
- Scalar docs: http://localhost:5205/scalar/v1
- Manual tests: `backend/Api/Api.http` (Cases 01–40)
- To reset the data: stop the API, delete `backend/Api/carshow.db`, run again.

## Run the frontend

Start the backend first (above), then in a second terminal:

```bash
cd frontend
npm install
npm run dev     # http://localhost:5173 (allowed by the API's CORS policy)
```

The API URL is read from `frontend/.env.development` (`VITE_API_BASE_URL=http://localhost:5205`).
See `frontend/README.md` for the sample-data switch and the project structure.

## Endpoints

| Method | Route | Success | Errors |
| ------ | ----- | ------- | ------ |
| POST | `/api/registrations` | 201 | 400, 409 |
| GET | `/api/registrations?type=&status=&participantName=&page=&pageSize=` | 200 | 400 |
| GET | `/api/registrations/{id}` | 200 | 404 |
| GET | `/api/registrations/summary` | 200 | — |

## Business rules

- Fees set by the server: Exhibitor ₱1,500, Competitor ₱2,500, VIP ₱5,000.
- Registration number `CS27-0001`, `CS27-0002`, … and registration date (UTC) set by the server; status starts `Pending`.
- Duplicate plate number → `409 Conflict`. Amount paid must be between 0 and the fee.
- `paymentStatus` (Unpaid / Partial / Paid) is computed, not stored.
- `/summary` excludes cancelled registrations from the money totals.
