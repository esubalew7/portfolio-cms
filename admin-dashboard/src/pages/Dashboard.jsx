import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  MessageSquare,
  FolderOpen,
  Activity,
  Clock,
  RefreshCw,
  Eye,
  Globe,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../components/ui/Card';
import api from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalMessages: 0,
    totalUsers: 0,
    totalVisitors: 0,
  });
  const [activities, setActivities] = useState([]);
  const [messages, setMessages] = useState([]);
  const [countries, setCountries] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, activityRes, messagesRes, analyticsRes] = await Promise.all([
        api.get('/api/dashboard/stats'),
        api.get('/api/dashboard/activity'),
        api.get('/api/contact').catch(() => ({ success: false, data: [] })),
        api.get('/api/analytics').catch(() => ({ success: false, data: {} })),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (activityRes.success) setActivities(activityRes.data);
      if (messagesRes.success) setMessages(Array.isArray(messagesRes.data) ? messagesRes.data.slice(0, 4) : []);
      if (analyticsRes.success) {
        setCountries(analyticsRes.data.countries?.slice(0, 5) || []);
        setChartData(analyticsRes.data.dailyVisits?.slice(-7) || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    { title: 'Total Visitors', value: stats.totalVisitors, icon: Eye, color: 'blue', trend: '+12%', up: true },
    { title: 'Projects', value: stats.totalProjects, icon: FolderOpen, color: 'purple', trend: '+3', up: true },
    { title: 'Messages', value: stats.totalMessages, icon: MessageSquare, color: 'emerald', trend: stats.totalMessages > 0 ? '+2' : '0', up: stats.totalMessages > 0 },
    { title: 'Uptime', value: '99.9%', icon: Activity, color: 'amber', trend: 'Online', up: true },
  ];

  const formatTime = (date) => {
    if (!date) return '';
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of your portfolio performance.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} hover>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <div className="flex items-center gap-1 text-xs font-medium">
                    {stat.trend && (
                      <>
                        {stat.up
                          ? <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                          : <ArrowDownRight className="w-3 h-3 text-red-500" />
                        }
                        <span className={stat.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                          {stat.trend}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}>
                  <Icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Activity + Messages 2-col */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Recent Activity</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Latest updates from your portfolio</p>
            </div>
          </div>
          <div className="mt-2 space-y-1">
            {activities.length > 0 ? (
              activities.slice(0, 5).map((activity) => (
                <div
                  key={`${activity.type}-${activity._id}`}
                  className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <div className={`p-2 rounded-lg shrink-0 ${
                    activity.type === 'message'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                  }`}>
                    {activity.type === 'message'
                      ? <MessageSquare className="w-3.5 h-3.5" />
                      : <FolderOpen className="w-3.5 h-3.5" />
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{activity.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{activity.name}</p>
                  </div>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 shrink-0">{formatTime(activity.time)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No recent activity</p>
            )}
          </div>
        </Card>

        {/* Latest Messages */}
        <Card>
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Latest Messages</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Recent contact form submissions</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/messages')}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all
            </button>
          </div>
          <div className="mt-2 space-y-1">
            {messages.length > 0 ? (
              messages.slice(0, 4).map((msg) => (
                <div
                  key={msg._id}
                  className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {msg.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{msg.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{msg.email}</p>
                  </div>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 shrink-0">{formatTime(msg.createdAt)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No messages yet</p>
            )}
          </div>
        </Card>
      </div>

      {/* Chart + Countries 2-col */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Chart */}
        <Card className="lg:col-span-2">
          <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Traffic Overview</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Daily visitors for the past 7 days</p>
          </div>
          <div className="mt-4 h-56">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">
                No traffic data yet
              </div>
            )}
          </div>
        </Card>

        {/* Top Countries */}
        <Card>
          <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Top Countries</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Visitor locations</p>
          </div>
          <div className="mt-4 space-y-3">
            {countries.length > 0 ? (
              countries.map((c, i) => (
                <div key={c.country || i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400">
                      {c.country?.slice(0, 2)?.toUpperCase() || '??'}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{c.country || 'Unknown'}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{c.count || 0}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No data yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
