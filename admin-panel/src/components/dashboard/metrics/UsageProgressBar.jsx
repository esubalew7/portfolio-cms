const colorClasses = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-emerald-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  cyan: 'bg-cyan-500',
};

const UsageProgressBar = ({ label, used, total, unit = 'MB', color = 'blue', showDetails = true }) => {
  const numericUsed = typeof used === 'string' ? parseFloat(used) || 0 : used;
  const numericTotal = typeof total === 'string' ? parseFloat(total) || 0 : total;
  const percent = numericTotal > 0 ? Math.min((numericUsed / numericTotal) * 100, 100) : 0;

  const barColor = percent > 90 ? 'bg-red-500' : percent > 75 ? 'bg-orange-500' : (colorClasses[color] || colorClasses.blue);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-300">{label}</span>
        {showDetails && (
          <span className="text-sm text-gray-400">
            {used} / {total} {unit}
          </span>
        )}
      </div>
      <div className="w-full h-2.5 bg-gray-700/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showDetails && (
        <p className="text-xs text-gray-500">{percent.toFixed(1)}% used</p>
      )}
    </div>
  );
};

export default UsageProgressBar;
