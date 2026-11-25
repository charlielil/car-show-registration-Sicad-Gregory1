import { useState } from "react";
import Modal from "./Modal.jsx";
import { createRegistration } from "../api";
import { formatCurrency } from "../utils/format.js";

// Fees are decided by the server; this table is only used to show a hint to the user.
const FEES = { Exhibitor: 1500, Competitor: 2500, VIP: 5000 };

const EMPTY = {
  participantName: "",
  contactNumber: "",
  email: "",
  address: "",
  carMakeModel: "",
  plateNumber: "",
  registrationType: "Exhibitor",
  amountPaid: "0",
};

const inputBase = "w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400";

function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs font-medium text-red-700">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}

/** POST /api/registrations. Field errors from the API (400 / 409) are shown next to the right input. */
export default function NewRegistrationModal({ onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (name) => (e) => {
    setForm((f) => ({ ...f, [name]: e.target.value }));
    if (fieldErrors[name]) setFieldErrors((errs) => ({ ...errs, [name]: undefined }));
  };

  const input = (name, extra = {}) => ({
    id: `new-${name}`,
    value: form[name],
    onChange: set(name),
    disabled: saving,
    "aria-invalid": fieldErrors[name] ? true : undefined,
    "aria-describedby": fieldErrors[name] ? `new-${name}-error` : undefined,
    className: `${inputBase} ${fieldErrors[name] ? "border-red-500 bg-red-50" : "border-slate-300 bg-white hover:border-slate-400"}`,
    ...extra,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    setFieldErrors({});
    try {
      const created = await createRegistration({
        participantName: form.participantName.trim(),
        contactNumber: form.contactNumber.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        carMakeModel: form.carMakeModel.trim(),
        plateNumber: form.plateNumber.trim(),
        registrationType: form.registrationType,
        amountPaid: form.amountPaid === "" ? 0 : Number(form.amountPaid),
      });
      onCreated(created);
    } catch (err) {
      setFieldErrors(err.fieldErrors ?? {});
      // Show a general message when no field could be matched (e.g. API offline).
      if (!Object.keys(err.fieldErrors ?? {}).length) setFormError(err.message);
      else setFormError("Please fix the highlighted fields.");
      setSaving(false);
    }
  }

  const fee = FEES[form.registrationType];

  return (
    <Modal title="New registration" onClose={onClose} wide>
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field id="new-participantName" label="Participant name" error={fieldErrors.participantName}>
              <input {...input("participantName")} type="text" placeholder="e.g. Juan Dela Cruz" autoFocus />
            </Field>
          </div>
          <Field id="new-contactNumber" label="Contact number" error={fieldErrors.contactNumber} hint="Format: 09XXXXXXXXX">
            <input {...input("contactNumber")} type="tel" placeholder="09171234567" />
          </Field>
          <Field id="new-email" label="Email" error={fieldErrors.email}>
            <input {...input("email")} type="email" placeholder="juan@example.com" />
          </Field>
          <div className="sm:col-span-2">
            <Field id="new-address" label="Address" error={fieldErrors.address}>
              <input {...input("address")} type="text" placeholder="123 Rizal St., Naga City" />
            </Field>
          </div>
          <Field id="new-carMakeModel" label="Car make / model" error={fieldErrors.carMakeModel}>
            <input {...input("carMakeModel")} type="text" placeholder="Toyota Supra MK4" />
          </Field>
          <Field id="new-plateNumber" label="Plate number" error={fieldErrors.plateNumber}>
            <input {...input("plateNumber")} type="text" placeholder="ABC 1234" />
          </Field>
          <Field
            id="new-registrationType"
            label="Registration type"
            error={fieldErrors.registrationType}
            hint={`Fee: ${formatCurrency(fee)}`}
          >
            <select {...input("registrationType")}>
              <option value="Exhibitor">Exhibitor</option>
              <option value="Competitor">Competitor</option>
              <option value="VIP">VIP</option>
            </select>
          </Field>
          <Field id="new-amountPaid" label="Amount paid (₱)" error={fieldErrors.amountPaid} hint="Between 0 and the fee">
            <input {...input("amountPaid")} type="number" min="0" step="0.01" inputMode="decimal" />
          </Field>
        </div>

        {formError && (
          <p role="alert" className="mx-5 mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-800">
            {formError}
          </p>
        )}

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save registration"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
