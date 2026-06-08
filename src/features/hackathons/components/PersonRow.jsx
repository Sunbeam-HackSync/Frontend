import { getInitials } from "../../../utils/formatters";

export default function PersonRow({ user, helper }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sm font-bold text-sky-200">
        {getInitials(user?.fullName)}
      </div>
      <div>
        <p className="font-semibold text-white">{user?.fullName || "Unknown User"}</p>
        <p className="text-sm text-slate-500">{helper || user?.email}</p>
      </div>
    </div>
  );
}