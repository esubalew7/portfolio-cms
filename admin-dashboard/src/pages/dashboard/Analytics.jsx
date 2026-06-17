import { useState, useEffect, useCallback } from 'react';
import {
  Users, Eye, TrendingUp, UserCheck, BarChart3, Clock,
  Globe, MapPin, HelpCircle, Monitor, Smartphone, Tablet,
  RefreshCw, Activity, MousePointerClick, Layout, ExternalLink,
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis,
} from 'recharts';
import api from '../../utils/api';
import AnalyticsStatCard from '../../components/dashboard/AnalyticsStatCard';
import ChartCard from '../../components/dashboard/ChartCard';

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl px-4 py-3">
        <p className="text-xs font-bold text-gray-900 dark:text-white mb-1.5">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} className="text-xs font-medium tabular-nums" style={{ color: entry.color || entry.stroke || '#888' }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200/60 dark:bg-gray-800/60 rounded-xl ${className}`} />
);

const ChartSkeleton = () => (
  <div className="space-y-3">
    <div className="flex justify-between">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-16" />
    </div>
    <Skeleton className="h-48 w-full" />
  </div>
);

const PeriodToggle = ({ periods, active, onChange }) => (
  <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 gap-0.5">
    {periods.map((p) => (
      <button
        key={p.key}
        onClick={() => onChange(p.key)}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
          active === p.key
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
      >
        {p.label}
      </button>
    ))}
  </div>
);

const Analytics = () => {
  const [overview, setOverview] = useState(null);
  const [charts, setCharts] = useState(null);
  const [locations, setLocations] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartPeriod, setChartPeriod] = useState('daily');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [overviewRes, chartsRes, locationsRes, portfolioRes, recentRes] = await Promise.all([
        api.get('/api/analytics/overview'),
        api.get('/api/analytics/charts'),
        api.get('/api/analytics/locations'),
        api.get('/api/analytics/portfolio'),
        api.get('/api/analytics/recent?limit=12'),
      ]);
      if (overviewRes.success) setOverview(overviewRes.data);
      if (chartsRes.success) setCharts(chartsRes.data);
      if (locationsRes.success) setLocations(locationsRes.data);
      if (portfolioRes.success) setPortfolioData(portfolioRes.data);
      if (recentRes.success) setRecentVisitors(recentRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <Activity className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-500 font-medium mb-2">{error}</p>
          <button onClick={fetchData} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const overviewCards = [
    { key: 'totalVisitors', label: 'Total Visitors', icon: Users, color: 'blue', sublabel: 'All time' },
    { key: 'uniqueVisitors', label: 'Unique Visitors', icon: UserCheck, color: 'green', sublabel: 'Distinct IPs' },
    { key: 'totalPageViews', label: 'Page Views', icon: Eye, color: 'purple', sublabel: 'Total impressions' },
    { key: 'returningVisitors', label: 'Returning Visitors', icon: TrendingUp, color: 'orange', sublabel: 'Visited more than once' },
    { key: 'bounceRate', label: 'Bounce Rate', icon: BarChart3, color: 'rose', sublabel: 'Single-page visits', trend: null },
    { key: 'todayVisitors', label: "Today's Visitors", icon: Clock, color: 'cyan', sublabel: 'Last 24 hours' },
  ];

  const chartConfig = {
    daily: { data: charts?.daily || [], xKey: 'label', title: 'Daily Visitors', subtitle: 'Last 30 days' },
    weekly: { data: charts?.weekly || [], xKey: 'label', title: 'Weekly Visitors', subtitle: 'Last 12 weeks' },
    monthly: { data: charts?.monthly || [], xKey: 'label', title: 'Monthly Visitors', subtitle: 'Last 12 months' },
  };
  const currentChart = chartConfig[chartPeriod];

  const activePeriods = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Visitor insights and portfolio performance</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {overviewCards.map((stat) => (
          <AnalyticsStatCard
            key={stat.key}
            icon={stat.icon}
            label={stat.label}
            value={loading ? '—' : (overview?.[stat.key] !== undefined ? (stat.key === 'bounceRate' ? `${overview[stat.key]}%` : overview[stat.key].toLocaleString()) : '—')}
            sublabel={stat.sublabel}
            color={stat.color}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ChartCard
            title={currentChart.title}
            subtitle={currentChart.subtitle}
            action={<PeriodToggle periods={activePeriods} active={chartPeriod} onChange={setChartPeriod} />}
          >
            {loading ? (
              <ChartSkeleton />
            ) : currentChart.data.length > 0 ? (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={currentChart.data} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                    <defs>
                      <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(156 163 175 / 0.15)" />
                    <XAxis dataKey={currentChart.xKey} tick={{ fill: 'rgb(156 163 175)', fontSize: 11 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: 'rgb(156 163 175)', fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} fill="url(#visitorGradient)" name="Visitors" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-56 flex items-center justify-center text-gray-400 dark:text-gray-600">
                <BarChart3 className="h-8 w-8 mb-2 mx-auto opacity-40" />
                <p className="text-sm">No data yet</p>
              </div>
            )}
          </ChartCard>
        </div>

        {/* This Week / This Month Mini Cards */}
        <div className="grid grid-cols-1 gap-4">
          <ChartCard title="This Week" subtitle="Current week visitors">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
                  {loading ? '—' : (overview?.weekVisitors ?? 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">vs last week</p>
              </div>
              <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-500/10 ring-1 ring-violet-100 dark:ring-violet-500/20">
                <TrendingUp className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
            </div>
          </ChartCard>
          <ChartCard title="This Month" subtitle="Current month visitors">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
                  {loading ? '—' : (overview?.monthVisitors ?? 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">vs last month</p>
              </div>
              <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-500/10 ring-1 ring-orange-100 dark:ring-orange-500/20">
                <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Location & Portfolio Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Location Analytics */}
        <ChartCard title="Location Analytics" subtitle="Where your visitors come from">
          {loading ? (
            <ChartSkeleton />
          ) : locations ? (
            <div className="space-y-4">
              {/* Unknown Traffic Indicator */}
              {locations.unknownTraffic?.count > 0 && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-500/10">
                  <HelpCircle className="h-5 w-5 text-amber-500 shrink-0" />
                  <div className="text-xs">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">{locations.unknownTraffic.count.toLocaleString()} visits</span>
                    <span className="text-amber-600 dark:text-amber-500"> ({locations.unknownTraffic.percentage}%) from unknown locations</span>
                  </div>
                </div>
              )}

              {/* Country Distribution */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2.5">Countries</h4>
                <div className="space-y-1.5">
                  {locations.countries?.slice(0, 7).map((c) => (
                    <div key={c.country} className="flex items-center gap-3">
                      <Globe className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <span className="text-xs text-gray-700 dark:text-gray-300 w-24 truncate">{c.country === 'Unknown' ? 'Unknown' : c.country}</span>
                      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${c.percentage}%`, backgroundColor: CHART_COLORS[locations.countries.indexOf(c) % CHART_COLORS.length] }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-12 text-right tabular-nums">{c.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* City Distribution */}
              {locations.cities?.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2.5">Top Cities</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {locations.cities.slice(0, 6).map((c) => (
                      <div key={`${c.country}-${c.city}`} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{c.city}</p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{c.country} · {c.visitors}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-600">
              <Globe className="h-8 w-8 mb-2 mx-auto opacity-40" />
              <p className="text-sm">No location data yet</p>
            </div>
          )}
        </ChartCard>

        {/* Portfolio Analytics */}
        <ChartCard title="Portfolio Analytics" subtitle="Content performance">
          {loading ? (
            <ChartSkeleton />
          ) : portfolioData ? (
            <div className="space-y-4">
              {/* Most Viewed Sections */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2.5">
                  <Layout className="h-3.5 w-3.5 inline mr-1.5 -mt-0.5" />
                  Most Viewed Sections
                </h4>
                <div className="space-y-1.5">
                  {portfolioData.sections?.slice(0, 5).map((s, idx) => (
                    <div key={s.page} className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-600 w-4 text-right tabular-nums">{idx + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize truncate">{s.page}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums ml-2">{s.visits}</span>
                        </div>
                        <div className="mt-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((s.visits / Math.max(...portfolioData.sections.map(x => x.visits))) * 100, 100)}%`, backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engagement Insights */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100/50 dark:border-blue-500/10">
                  <div className="flex items-center gap-2 mb-1.5">
                    <MousePointerClick className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Social Clicks</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-300 tabular-nums">—</p>
                  <p className="text-[10px] text-blue-500 dark:text-blue-400 mt-0.5">Tracking coming soon</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-500/5 border border-purple-100/50 dark:border-purple-500/10">
                  <div className="flex items-center gap-2 mb-1.5">
                    <ExternalLink className="h-3.5 w-3.5 text-purple-500" />
                    <span className="text-[10px] font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider">Project Clicks</span>
                  </div>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-300 tabular-nums">—</p>
                  <p className="text-[10px] text-purple-500 dark:text-purple-400 mt-0.5">Tracking coming soon</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-600">
              <Layout className="h-8 w-8 mb-2 mx-auto opacity-40" />
              <p className="text-sm">No portfolio data yet</p>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Device Distribution & Recent Visitors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Visitors */}
        <div className="lg:col-span-2">
          <ChartCard title="Recent Visitors" subtitle="Latest activity">
            {loading ? (
              <ChartSkeleton />
            ) : recentVisitors.length > 0 ? (
              <div className="overflow-x-auto -mx-1">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      <th className="pb-2.5 pr-3">Visitor</th>
                      <th className="pb-2.5 pr-3">Device</th>
                      <th className="pb-2.5 pr-3">Browser</th>
                      <th className="pb-2.5 pr-3">Page</th>
                      <th className="pb-2.5">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                    {recentVisitors.map((v) => (
                      <tr key={v._id} className="text-gray-700 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="py-2.5 pr-3">
                          <div className="flex items-center gap-2">
                            <Globe className="h-3 w-3 text-gray-400 shrink-0" />
                            <span className="truncate max-w-[80px]">{v.country === 'Unknown' ? '—' : v.country}</span>
                            {v.city && v.city !== 'Unknown' && (
                              <span className="text-[10px] text-gray-400 hidden sm:inline">({v.city})</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 pr-3">
                          <div className="flex items-center gap-1.5">
                            {v.device === 'Mobile' ? (
                              <Smartphone className="h-3 w-3 text-gray-400" />
                            ) : v.device === 'Tablet' ? (
                              <Tablet className="h-3 w-3 text-gray-400" />
                            ) : (
                              <Monitor className="h-3 w-3 text-gray-400" />
                            )}
                            <span>{v.device}</span>
                          </div>
                        </td>
                        <td className="py-2.5 pr-3 text-gray-500">{v.browser || '—'}</td>
                        <td className="py-2.5 pr-3">
                          <span className="capitalize text-gray-500">{v.page}</span>
                        </td>
                        <td className="py-2.5 text-gray-400 whitespace-nowrap">
                          {new Date(v.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-gray-400 dark:text-gray-600">
                <Users className="h-8 w-8 mb-2 mx-auto opacity-40" />
                <p className="text-sm">No visitors yet</p>
              </div>
            )}
          </ChartCard>
        </div>

        {/* Device Distribution */}
        <ChartCard title="Device Distribution" subtitle="Desktop vs Mobile vs Tablet">
          {loading ? (
            <ChartSkeleton />
          ) : recentVisitors.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={(() => {
                      const counts = { Desktop: 0, Mobile: 0, Tablet: 0 };
                      recentVisitors.forEach(v => { counts[v.device] = (counts[v.device] || 0) + 1; });
                      return Object.entries(counts).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));
                    })()}
                    cx="50%" cy="50%" innerRadius={44} outerRadius={68} paddingAngle={4}
                    dataKey="value" nameKey="name"
                  >
                    {['#3b82f6', '#10b981', '#8b5cf6'].slice(0, 3).map((color, idx) => (
                      <Cell key={idx} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-1">
                {['Desktop', 'Mobile', 'Tablet'].map((name) => {
                  const count = recentVisitors.filter(v => v.device === name).length;
                  if (count === 0) return null;
                  return (
                    <div key={name} className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                      <span className="h-2 w-2 rounded-full" style={{
                        backgroundColor: name === 'Desktop' ? '#3b82f6' : name === 'Mobile' ? '#10b981' : '#8b5cf6'
                      }} />
                      {name} <span className="font-medium text-gray-700 dark:text-gray-300">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-600">
              <Monitor className="h-8 w-8 mb-2 mx-auto opacity-40" />
              <p className="text-sm">No device data</p>
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default Analytics;
