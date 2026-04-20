const colorMap = {
  UNPAID: "bg-slate-100 text-slate-700 ring-slate-200",
  PENDING: "bg-amber-100 text-amber-700 ring-amber-200",
  MATCHED: "bg-sky-100 text-sky-700 ring-sky-200",
  APPROVED: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  REJECTED: "bg-rose-100 text-rose-700 ring-rose-200",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide ring-1 ${colorMap[status] ?? "bg-slate-100 text-slate-700 ring-slate-200"}`}
    >
      {status}
    </span>
  );
}
