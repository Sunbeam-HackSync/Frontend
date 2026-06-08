export default function StatCard({ label, value, helper, icon: Icon }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
        </div>

        {Icon && (
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-sky-300">
            <Icon />
          </div>
        )}
      </div>

      {helper && <p className="mt-3 text-sm text-slate-500">{helper}</p>}
    </div>
  );
}
