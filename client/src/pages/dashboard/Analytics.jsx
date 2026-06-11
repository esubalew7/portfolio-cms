import { useState, useEffect, useCallback } from 'react';
import { Users, Eye, Globe, TrendingUp, Activity, MapPin, Monitor, Smartphone, Tablet, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../utils/api';

const statCards = [
  { key: 'totalVisitors', label: 'Total Visitors', icon: Users, color: 'blue' },
  { key: 'todayVisitors', label: 'Today', icon: Eye, color: 'green' },
  { key: 'weekVisitors', label: 'This Week', icon: TrendingUp, color: 'purple' },
  { key: 'monthVisitors', label: 'This Month', icon: Activity, color: 'orange' },
];

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg px-4 py-3">
        <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl ${className}`} />
);

const Analytics = () => {
  const [overview, setOverview] = useState(null);
  const [topPages, setTopPages] = useState([]);
  const [countries, setCountries] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [overviewRes, pagesRes, countriesRes, recentRes] = await Promise.all([
        api.get('/api/analytics/overview'),
        api.get('/api/analytics/top-pages'),
        api.get('/api/analytics/countries'),
        api.get('/api/analytics/recent?limit=20'),
      ]);
      if (overviewRes.success) setOverview(overviewRes.data);
      if (pagesRes.success) setTopPages(pagesRes.data);
      if (countriesRes.success) setCountries(countriesRes.data);
      if (recentRes.success) setRecentVisitors(recentRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error && !overview) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Activity className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-500 font-medium mb-2">{error}</p>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Visitor insights and page statistics</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading && !overview ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            const value = overview?.[stat.key] ?? 0;
            return (
              <div
                key={stat.key}
                className="relative group bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-800/50 shadow-lg shadow-gray-200/50 dark:shadow-black/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 to-transparent dark:from-gray-800/20 dark:to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value.toLocaleString()}</p>
                  </div>
                  <div className={`p-3.5 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 ring-1 ring-${stat.color}-100 dark:ring-${stat.color}-800/30`}>
                    <Icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {loading && !overview ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-800/50 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Visitors Last 7 Days</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Daily unique visitor count</p>
              {overview?.last7Days && overview.last7Days.length > 0 ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={overview.last7Days} barSize={32} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgb(156 163 175 / 0.2)" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: 'rgb(156 163 175)', fontSize: 12 }}
                        tickLine={false}
                        tickFormatter={(val) => {
                          const d = new Date(val);
                          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        }}
                      />
                      <YAxis tick={{ fill: 'rgb(156 163 175)', fontSize: 12 }} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="visitors" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Visitors" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-72 flex items-center justify-center text-gray-400 dark:text-gray-600">
                  <p>No data yet</p>
                </div>
              )}
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-800/50 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Top Countries</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Visitor distribution</p>
              {countries.length > 0 ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={countries.slice(0, 6)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="visitors"
                        nameKey="country"
                      >
                        {countries.slice(0, 6).map((entry, idx) => (
                          <Cell key={entry.country} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-3 mt-2">
                    {countries.slice(0, 6).map((c, idx) => (
                      <div key={c.country} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                        {c.country}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-72 flex items-center justify-center text-gray-400 dark:text-gray-600">
                  <Globe className="h-8 w-8 mb-2 mx-auto opacity-40" />
                  <p>No country data yet</p>
                </div>
              )}
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-800/50 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Most Viewed Pages</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Page visit counts</p>
              {topPages.length > 0 ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topPages.slice(0, 8)} layout="vertical" barSize={24} barGap={2}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgb(156 163 175 / 0.2)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: 'rgb(156 163 175)', fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis
                        type="category"
                        dataKey="page"
                        tick={{ fill: 'rgb(156 163 175)', fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        width={80}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="visits" fill="#8b5cf6" radius={[0, 8, 8, 0]} name="Visits" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-72 flex items-center justify-center text-gray-400 dark:text-gray-600">
                  <MapPin className="h-8 w-8 mb-2 mx-auto opacity-40" />
                  <p>No page data yet</p>
                </div>
              )}
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-800/50 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Visitors</h3>
              {recentVisitors.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        <th className="pb-3 pr-4">Country</th>
                        <th className="pb-3 pr-4">Device</th>
                        <th className="pb-3 pr-4">Browser</th>
                        <th className="pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {recentVisitors.map((v) => (
                        <tr key={v._id} className="text-gray-700 dark:text-gray-300">
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <Globe className="h-3.5 w-3.5 text-gray-400" />
                              <span>{v.country}</span>
                              {v.city !== 'Unknown' && (
                                <span className="text-xs text-gray-400">({v.city})</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-1.5">
                              {v.device === 'Mobile' ? (
                                <Smartphone className="h-3.5 w-3.5 text-gray-400" />
                              ) : v.device === 'Tablet' ? (
                                <Tablet className="h-3.5 w-3.5 text-gray-400" />
                              ) : (
                                <Monitor className="h-3.5 w-3.5 text-gray-400" />
                              )}
                              <span>{v.device}</span>
                            </div>
                          </td>
                          <td className="py-3 pr-4">{v.browser}</td>
                          <td className="py-3 text-gray-400 text-xs whitespace-nowrap">
                            {new Date(v.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-600">
                  <Users className="h-8 w-8 mb-2 mx-auto opacity-40" />
                  <p>No visitors yet</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
