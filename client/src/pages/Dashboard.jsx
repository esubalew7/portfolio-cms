import { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  FolderOpen,
  Activity,
  Clock,
  RefreshCw
} from 'lucide-react';
import api from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalMessages: 0,
    totalUsers: 0
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, activityRes] = await Promise.all([
        api.get('/api/dashboard/stats'),
        api.get('/api/dashboard/activity')
      ]);
      
      if (statsRes.success) setStats(statsRes.data);
      if (activityRes.success) setActivities(activityRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Messages',
      value: stats.totalMessages,
      icon: MessageSquare,
      color: 'green'
    },
    {
      title: 'Projects',
      value: stats.totalProjects,
      icon: FolderOpen,
      color: 'purple'
    },
    {
      title: 'Real-time Status',
      value: 'Online',
      icon: Activity,
      color: 'orange'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-10 w-10 text-blue-600 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading real-time data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your portfolio.
          </p>
        </div>
        <div className="sm:text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Latest updates from your database
            </p>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={`${activity.type}-${activity._id}`}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'message'
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'bg-purple-50 dark:bg-purple-900/20'
                    }`}>
                      {activity.type === 'message' ? (
                        <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <FolderOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.type === 'message' ? `from ${activity.name}` : `Title: ${activity.name}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(activity.time).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              No recent activity found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default Dashboard;