const DashboardCard = ({ title, value, icon, color, trend, trendUp }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-200/50">
      {/* Decorative gradient orb */}
      <div
        className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${color || "from-orange-400 to-orange-500"} opacity-10 transition-all duration-300 group-hover:scale-125 group-hover:opacity-20`}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            {title}
          </p>
          <p className="mt-2 text-2xl font-extrabold text-gray-900 tabular-nums">
            {value}
          </p>
        </div>

        {icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color || "from-orange-400 to-orange-500"} text-lg text-white shadow-lg shadow-orange-500/20`}
          >
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
              trendUp
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {trendUp ? "↑" : "↓"} {trend}
          </span>
          <span className="text-[10px] text-gray-400">vs yesterday</span>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
