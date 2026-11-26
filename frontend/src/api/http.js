export const API_BASE_URL = (
  import.meta.env?.VITE_API_BASE_URL || "http://localhost:5205"
).replace(/\/+$/, "");

/**
 * Error thrown by every API function.
 *  - status      HTTP status (0 = the API could not be reached at all)
 *  - fieldErrors { plateNumber: "message", ... } for 400 / 409 so a form can show them next to the field
 */
export class ApiError extends Error {
  constructor(message, { status = 0, fieldErrors = {}, network = false } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.network = network;
  }
}

/** "PlateNumber" -> "plateNumber", "$.amountPaid" -> "amountPaid" */
function toFieldName(key) {
  const name = key.replace(/^\$\.?/, "");
  return name.charAt(0).toLowerCase() + name.slice(1);
}

/** Turns an ASP.NET ProblemDetails / ValidationProblemDetails body into an ApiError. */
function buildError(status, body) {
  const fieldErrors = {};

  if (body && typeof body.errors === "object" && body.errors !== null) {
    for (const [key, messages] of Object.entries(body.errors)) {
      const list = Array.isArray(messages) ? messages : [String(messages)];
      fieldErrors[toFieldName(key)] = list.join(" ");
    }
  }

  const firstField = Object.values(fieldErrors)[0];
  let message;
  if (status === 400) {
    message = firstField || body?.detail || "Some of the information is not valid.";
  } else if (status === 404) {
    message = body?.detail || "The requested record was not found.";
  } else if (status === 409) {
    message = body?.detail || "This record already exists.";
    if (!Object.keys(fieldErrors).length && /plate/i.test(message)) {
      fieldErrors.plateNumber = message;
    }
  } else {
    message = body?.detail || body?.title || `The API returned an error (HTTP ${status}).`;
  }

  return new ApiError(message, { status, fieldErrors });
}

/**
 * Small wrapper around fetch():
 *  - builds the query string (skips empty values)
 *  - sends/reads JSON
 *  - converts failures into ApiError
 */
export async function request(path, { method = "GET", query, body, signal } = {}) {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      signal,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err.name === "AbortError") throw err; // caller cancelled on purpose
    throw new ApiError(
      `Cannot reach the API at ${API_BASE_URL}. Make sure the backend is running (dotnet run --project Api).`,
      { network: true },
    );
  }

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) throw buildError(response.status, data);
  return data;
}
