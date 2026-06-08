const toneClasses = {
  green: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  red: "border-rose-500/20 bg-rose-500/10 text-rose-300",
  yellow: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  blue: "border-sky-500/20 bg-sky-500/10 text-sky-300",
  purple: "border-violet-500/20 bg-violet-500/10 text-violet-300",
  slate: "border-slate-700 bg-slate-800 text-slate-300",
};

const statusTone = {
  LIVE: "green",
  APPROVED: "blue",
  PENDING_APPROVAL: "yellow",
  PENDING: "yellow",
  APPROVED_REGISTRATION: "green",
  REJECTED: "red",
  SUSPENDED: "red",
  SUBMITTED: "green",
  DRAFT: "slate",
  OPEN: "yellow",
  CLAIMED: "blue",
  RESOLVED: "green",
  COMPLETED: "green",
  IN_REVIEW: "purple",
  CONFLICT_FLAGGED: "red",
  HIGH: "red",
  MEDIUM: "yellow",
  LOW: "green",
};

function getStatusTone(status) {
  return statusTone[status] || statusTone[`APPROVED_${status}`] || "slate";
}

export default function Badge({ children, tone, className = "" }) {
  const resolvedTone = tone || getStatusTone(children);

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-lg
        border
        px-2.5
        py-1
        text-xs
        font-semibold
        ${toneClasses[resolvedTone]}
        ${className}
      `}
    >
      {String(children).replaceAll("_", " ")}
    </span>
  );
}
