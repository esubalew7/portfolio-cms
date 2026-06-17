const AnalyticsStatCard = ({ icon: Icon, label, value, sublabel, trend, color = 'blue' }) => {
  const colorMap = {
    blue: { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-100 dark:ring-blue-500/20' },
    green: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-100 dark:ring-emerald-500/20' },
    purple: { bg: 'bg-violet-50 dark:bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', ring: 'ring-violet-100 dark:ring-violet-500/20' },
    orange: { bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', ring: 'ring-orange-100 dark:ring-orange-500/20' },
    rose: { bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', ring: 'ring-rose-100 dark:ring-rose-500/20' },
    cyan: { bg: 'bg-cyan-50 dark:bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', ring: 'ring-cyan-100 dark:ring-cyan-500/20' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-100 dark:ring-amber-500/20' },
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', ring: 'ring-indigo-100 dark:ring-indigo-500/20' },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="relative group bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-5 border border-white/20 dark:border-gray-800/50 shadow-lg shadow-gray-200/50 dark:shadow-black/20 hover:shadow-xl transition-all duration-300">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 to-transparent dark:from-gray-800/20 dark:to-transparent pointer-events-none" />
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1.5 tabular-nums">
            {value ?? '—'}
          </p>
          {sublabel && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sublabel}</p>
          )}
          {trend !== undefined && (
            <p className={`text-xs font-medium mt-1.5 ${trend >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${c.bg} ring-1 ${c.ring} shrink-0 ml-3`}>
            <Icon className={`h-5 w-5 ${c.text}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsStatCard;
