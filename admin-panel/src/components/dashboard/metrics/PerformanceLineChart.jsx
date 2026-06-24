const PerformanceLineChart = ({ data = [], color = '#3B82F6', height = 150, width = 400 }) => {
  if (!data.length || data.length < 2) {
    return (
      <div className="flex items-center justify-center text-gray-500 text-sm" style={{ height }}>
        Not enough data points
      </div>
    );
  }

  const values = data.map(d => d.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const padding = { top: 10, bottom: 20, left: 0, right: 0 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.value - min) / range) * chartHeight;
    return `${x},${y}`;
  });

  const polyline = points.join(' ');

  const areaPoints = [
    `${padding.left},${padding.top + chartHeight}`,
    ...points,
    `${padding.left + chartWidth},${padding.top + chartHeight}`,
  ].join(' ');

  return (
    <svg width={width} height={height} className="w-full" style={{ maxHeight: height }}>
      {/* Grid lines */}
      <line x1={padding.left} y1={padding.top} x2={width - padding.right} y2={padding.top} stroke="#374151" strokeWidth="1" strokeDasharray="4" />
      <line x1={padding.left} y1={padding.top + chartHeight / 2} x2={width - padding.right} y2={padding.top + chartHeight / 2} stroke="#374151" strokeWidth="1" strokeDasharray="4" />
      <line x1={padding.left} y1={padding.top + chartHeight} x2={width - padding.right} y2={padding.top + chartHeight} stroke="#374151" strokeWidth="1" strokeDasharray="4" />
      {/* Area fill */}
      <polygon points={areaPoints} fill={`${color}20`} />
      {/* Line */}
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots */}
      {data.map((d, i) => {
        const x = padding.left + (i / (data.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((d.value - min) / range) * chartHeight;
        return <circle key={i} cx={x} cy={y} r="3" fill={color} stroke="#111827" strokeWidth="1" />;
      })}
      {/* Labels */}
      <text x={padding.left} y={padding.top - 4} fill="#6B7280" fontSize="10">{max}ms</text>
      <text x={padding.left} y={padding.top + chartHeight / 2 + 4} fill="#6B7280" fontSize="10">{Math.round((max + min) / 2)}ms</text>
      <text x={padding.left} y={height - 4} fill="#6B7280" fontSize="10">{data[0]?.label || ''}</text>
      <text x={width - padding.right} y={height - 4} fill="#6B7280" fontSize="10" textAnchor="end">{data[data.length - 1]?.label || ''}</text>
    </svg>
  );
};

export default PerformanceLineChart;
