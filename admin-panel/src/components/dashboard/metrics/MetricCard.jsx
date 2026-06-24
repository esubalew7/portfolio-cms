const gradients = {
  blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/30',
  purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/30',
  green: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30',
  orange: 'from-orange-500/20 to-orange-600/5 border-orange-500/30',
  red: 'from-red-500/20 to-red-600/5 border-red-500/30',
  cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/30',
};

const iconColors = {
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  green: 'text-emerald-400',
  orange: 'text-orange-400',
  red: 'text-red-400',
  cyan: 'text-cyan-400',
};

const MetricCard = ({ title, value, icon: Icon, color = 'blue', subtitle, isLoading }) => {
  return (
    <div className={`relative overflow-hidden rounded-xl border bg-gradient-to-br backdrop-blur-xl bg-white/5 dark:bg-gray-800/40 p-5 ${gradients[color] || gradients.blue}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            {title}
          </p>
          {isLoading ? (
            <div className="mt-2 h-8 w-24 bg-gray-700/50 rounded animate-pulse" />
          ) : (
            <p className="mt-1 text-2xl font-bold text-white truncate">
              {value ?? '—'}
            </p>
          )}
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg bg-white/5 ${iconColors[color] || iconColors.blue}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
