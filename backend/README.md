# Car Show Registration API

The .NET 10 API is implemented with vertical slices, EF Core 10, SQLite, and FluentValidation.

## Run

From this directory:

```bash
dotnet run --project Api
```

The database uses `Data Source=carshow.db`. It is created and seeded with sample registrations on first run. Development API documentation is available at `/scalar/v1`.

## Routes

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/registrations` | Create a registration |
| `GET` | `/api/registrations` | List, filter, and paginate registrations |
| `GET` | `/api/registrations/{id}` | Get a registration by ID |
| `GET` | `/api/registrations/summary` | Get registration summary totals |
