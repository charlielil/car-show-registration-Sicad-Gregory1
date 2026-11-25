import { request } from "./http.js";

/**
 * Real API calls to the C# backend.
 * Function names and return shapes are identical to sample-data.js,
 * so the UI does not care which one is used (see src/api/index.js).
 */

/**
 * GET /api/registrations?participantName=&type=&status=&page=&pageSize=
 * -> { items, page, pageSize, totalCount, totalPages }
 */
export function getRegistrations(
  { participantName = "", type = "", status = "", page = 1, pageSize = 10 } = {},
  { signal } = {},
) {
  return request("/api/registrations", {
    query: { participantName, type, status, page, pageSize },
    signal,
  });
}

/**
 * GET /api/registrations/summary
 * -> { totalRegistrations, confirmed, checkedIn, pending, cancelled,
 *      totalFees, totalPayments, uncollectedPayments }
 */
export function getSummary({ signal } = {}) {
  return request("/api/registrations/summary", { signal });
}

/** GET /api/registrations/{id} -> one registration */
export function getRegistrationById(id, { signal } = {}) {
  return request(`/api/registrations/${encodeURIComponent(id)}`, { signal });
}

/**
 * POST /api/registrations -> the created registration (201)
 * Throws ApiError with fieldErrors on 400 (validation) and 409 (duplicate plate).
 */
export function createRegistration(payload) {
  return request("/api/registrations", { method: "POST", body: payload });
}
