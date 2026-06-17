const ChartCard = ({ title, subtitle, children, className = '', action }) => {
  return (
    <div className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-5 border border-white/20 dark:border-gray-800/50 shadow-lg shadow-gray-200/50 dark:shadow-black/20 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0 ml-3">{action}</div>}
      </div>
      {children}
    </div>
  );
};

export default ChartCard;
