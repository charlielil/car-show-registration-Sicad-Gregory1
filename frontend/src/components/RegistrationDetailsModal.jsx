import { useEffect, useState } from "react";
import Modal from "./Modal.jsx";
import StatusBadge from "./StatusBadge.jsx";
import PaymentBadge from "./PaymentBadge.jsx";
import { getRegistrationById } from "../api";
import { formatCurrency, formatDate } from "../utils/format.js";

function Field({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-slate-900">{children}</dd>
    </div>
  );
}

/** Shows one registration. Starts with the row that was clicked, then refreshes it with GET /api/registrations/{id}. */
export default function RegistrationDetailsModal({ registration, onClose }) {
  const [detail, setDetail] = useState(registration);
  const [refreshing, setRefreshing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    getRegistrationById(registration.id, { signal: controller.signal })
      .then((fresh) => {
        setDetail(fresh);
        setRefreshing(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err);
        setRefreshing(false);
      });
    return () => controller.abort();
  }, [registration.id]);

  const balance = detail.registrationFee - detail.amountPaid;

  return (
    <Modal title={`Registration ${detail.registrationNumber}`} onClose={onClose} wide>
      <div className="space-y-5 px-5 py-5">
        {refreshing && <p className="text-xs text-slate-500">Refreshing details…</p>}
        {error && (
          <p role="alert" className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Could not refresh from the API ({error.message}). Showing the data from the list.
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={detail.status} />
          <PaymentBadge status={detail.paymentStatus} />
          <span className="text-sm text-slate-600">{detail.registrationType}</span>
        </div>

        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <Field label="Participant">{detail.participantName}</Field>
          <Field label="Registered on">{formatDate(detail.registrationDate)}</Field>
          <Field label="Contact number">{detail.contactNumber}</Field>
          <Field label="Email">{detail.email}</Field>
          <Field label="Address">{detail.address}</Field>
          <Field label="Car">
            {detail.carMakeModel} · <span className="font-mono">{detail.plateNumber}</span>
          </Field>
        </dl>

        <dl className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4 text-right">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fee</dt>
            <dd className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900">{formatCurrency(detail.registrationFee)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Paid</dt>
            <dd className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900">{formatCurrency(detail.amountPaid)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Balance</dt>
            <dd className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900">{formatCurrency(balance)}</dd>
          </div>
        </dl>
      </div>
      <div className="flex justify-end border-t border-slate-200 px-5 py-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
