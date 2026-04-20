export default function DashboardCard({ title, value, subtitle, accent = "from-sky-500 to-cyan-500" }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-5 shadow-lg shadow-slate-200/60 backdrop-blur">
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accent}`} />
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}
