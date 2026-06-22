const StoragePieChart = ({ data = [], size = 200 }) => {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center text-gray-500 text-sm" style={{ width: size, height: size }}>
        No data available
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center text-gray-500 text-sm" style={{ width: size, height: size }}>
        No storage data
      </div>
    );
  }

  let cumulativePercent = 0;
  const gradientParts = data.map((d) => {
    const percent = (d.value / total) * 100;
    const start = cumulativePercent;
    cumulativePercent += percent;
    return `${d.color} ${start}% ${cumulativePercent}%`;
  });

  const conicGradient = `conic-gradient(${gradientParts.join(', ')})`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          background: conicGradient,
          boxShadow: '0 0 20px rgba(0,0,0,0.3)',
        }}
      >
        <div className="flex items-center justify-center w-full h-full">
          <div className="rounded-full bg-gray-900 w-[60%] h-[60%] flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-white">{total}</span>
            <span className="text-xs text-gray-400">bytes</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-gray-400">
              {d.label} ({((d.value / total) * 100).toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoragePieChart;
