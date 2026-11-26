/**
 * The ONE place that decides where data comes from.
 * Components import from "../api" and never care which source is active.
 *
 *   VITE_USE_SAMPLE_DATA=false  ->  registrationsApi.js  (real C# API)   [default]
 *   VITE_USE_SAMPLE_DATA=true   ->  sample-data.js       (browser only)
 *
 * Set it in frontend/.env.development and restart `npm run dev`.
 */
import * as realApi from "./registrationsApi.js";
import * as sampleApi from "./sample-data.js";

export const USING_SAMPLE_DATA = import.meta.env.VITE_USE_SAMPLE_DATA === "true";

const source = USING_SAMPLE_DATA ? sampleApi : realApi;

export const getRegistrations = source.getRegistrations;
export const getSummary = source.getSummary;
export const getRegistrationById = source.getRegistrationById;
export const createRegistration = source.createRegistration;
