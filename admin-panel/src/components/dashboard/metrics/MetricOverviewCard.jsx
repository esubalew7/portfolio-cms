const gradients = {
  green: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30',
  blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/30',
  amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/30',
  red: 'from-red-500/20 to-red-600/5 border-red-500/30',
};

const dotColors = {
  green: 'bg-emerald-400',
  blue: 'bg-blue-400',
  amber: 'bg-amber-400',
  red: 'bg-red-400',
};

const MetricOverviewCard = ({ title, value, icon: Icon, status = 'green', description, isLoading }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br backdrop-blur-xl bg-white/5 dark:bg-gray-800/40 p-5 ${gradients[status] || gradients.blue}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${dotColors[status] || dotColors.blue}`} />
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {title}
            </p>
          </div>
          {isLoading ? (
            <div className="mt-2 h-8 w-28 bg-gray-700/50 rounded animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-white truncate">
              {value ?? '—'}
            </p>
          )}
          {isLoading ? (
            <div className="mt-1.5 h-4 w-36 bg-gray-700/50 rounded animate-pulse" />
          ) : (
            <p className="mt-1 text-xs text-gray-400">{description || '\u00A0'}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl bg-white/5 dark:bg-white/5 ring-1 ring-white/10 shrink-0`}>
            <Icon className={`w-5 h-5 ${status === 'green' ? 'text-emerald-400' : status === 'blue' ? 'text-blue-400' : status === 'amber' ? 'text-amber-400' : 'text-red-400'}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricOverviewCard;
