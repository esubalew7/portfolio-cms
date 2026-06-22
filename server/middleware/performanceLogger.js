const MAX_RECORDS = 1000;
const recentRequests = [];

export function recordRequest(path, method, duration, statusCode) {
  recentRequests.push({
    path,
    method,
    duration,
    statusCode,
    timestamp: Date.now(),
  });

  if (recentRequests.length > MAX_RECORDS) {
    recentRequests.shift();
  }
}

export function getPerformanceMetrics() {
  const now = Date.now();
  const fiveMinAgo = now - 5 * 60 * 1000;

  const recent = recentRequests.filter(r => r.timestamp > fiveMinAgo);
  const allTime = recentRequests;

  const routeStats = {};
  for (const req of allTime) {
    const key = `${req.method} ${req.path}`;
    if (!routeStats[key]) {
      routeStats[key] = { count: 0, totalDuration: 0, max: 0, min: Infinity };
    }
    routeStats[key].count += 1;
    routeStats[key].totalDuration += req.duration;
    routeStats[key].max = Math.max(routeStats[key].max, req.duration);
    routeStats[key].min = Math.min(routeStats[key].min, req.duration);
  }

  const routeDetails = Object.entries(routeStats).map(([route, stats]) => ({
    route,
    count: stats.count,
    avgDuration: parseFloat((stats.totalDuration / stats.count).toFixed(2)),
    maxDuration: stats.max,
    minDuration: stats.min === Infinity ? 0 : stats.min,
  }));

  const slowest = [...routeDetails].sort((a, b) => b.avgDuration - a.avgDuration).slice(0, 5);

  const avgDuration = allTime.length > 0
    ? parseFloat((allTime.reduce((sum, r) => sum + r.duration, 0) / allTime.length).toFixed(2))
    : 0;

  const recentAvgDuration = recent.length > 0
    ? parseFloat((recent.reduce((sum, r) => sum + r.duration, 0) / recent.length).toFixed(2))
    : 0;

  const timeSeries = allTime.slice(-20).map(r => ({
    timestamp: r.timestamp,
    duration: r.duration,
    label: new Date(r.timestamp).toLocaleTimeString(),
  }));

  const rpm = recent.length > 0 ? parseFloat((recent.length / 5).toFixed(1)) : 0;

  return {
    totalRequests: allTime.length,
    avgDuration,
    recentAvgDuration,
    rpm,
    routeDetails,
    slowest,
    timeSeries,
  };
}

export function performanceLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    recordRequest(req.path, req.method, duration, res.statusCode);
  });

  next();
}
