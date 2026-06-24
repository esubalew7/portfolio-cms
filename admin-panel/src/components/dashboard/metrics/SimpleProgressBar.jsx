const colorMap = {
  green: 'bg-emerald-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
};

const SimpleProgressBar = ({ percent = 0, color = 'blue', size = 'md', showLabel = true }) => {
  const clampedPercent = Math.min(Math.max(percent, 0), 100);
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';

  const barColor = clampedPercent > 90 ? 'bg-red-500' : clampedPercent > 75 ? 'bg-amber-500' : (colorMap[color] || colorMap.blue);

  return (
    <div className="space-y-1">
      <div className={`w-full bg-gray-700/50 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-500">{clampedPercent.toFixed(1)}% used</p>
      )}
    </div>
  );
};

export default SimpleProgressBar;
