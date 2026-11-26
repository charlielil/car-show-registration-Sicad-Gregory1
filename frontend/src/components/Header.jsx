import { IconCar, IconPlus } from "./Icons.jsx";

export default function Header({ usingSampleData, onNewRegistration }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <IconCar className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold leading-tight text-slate-900">Car Show 2027</h1>
            <p className="text-sm text-slate-600">Registration Dashboard · Sorsogon City Coliseum</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {usingSampleData && (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-300">
              Sample data mode
            </span>
          )}
          <button
            type="button"
            onClick={onNewRegistration}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <IconPlus className="h-4 w-4" />
            New registration
          </button>
        </div>
      </div>
    </header>
  );
}
