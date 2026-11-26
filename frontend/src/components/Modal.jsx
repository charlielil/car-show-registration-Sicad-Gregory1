import { useEffect, useRef } from "react";
import { IconX } from "./Icons.jsx";

/** Simple accessible dialog: Esc or a click on the dark backdrop closes it. */
export default function Modal({ title, onClose, children, wide = false }) {
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose; // always call the latest onClose without re-running the effect

  useEffect(() => {
    // Focus the Close button unless a field inside the dialog already took focus (autoFocus).
    if (!dialogRef.current?.contains(document.activeElement)) closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onCloseRef.current();
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 sm:items-center"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full ${wide ? "max-w-2xl" : "max-w-lg"} rounded-2xl bg-white shadow-xl`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close"
          >
            <IconX />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
