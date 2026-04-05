import {
  Users,
  MessageSquare,
  FolderOpen,
  Activity,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '2,543',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Messages',
      value: '156',
      change: '+8%',
      changeType: 'positive',
      icon: MessageSquare,
      color: 'green'
    },
    {
      title: 'Projects',
      value: '24',
      change: '+4%',
      changeType: 'positive',
      icon: FolderOpen,
      color: 'purple'
    },
    {
      title: 'Active Sessions',
      value: '89',
      change: '-2%',
      changeType: 'negative',
      icon: Activity,
      color: 'orange'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'New message received',
      user: 'John Doe',
      time: '2 minutes ago',
      type: 'message'
    },
    {
      id: 2,
      action: 'Project updated',
      user: 'Jane Smith',
      time: '15 minutes ago',
      type: 'project'
    },
    {
      id: 3,
      action: 'New user registered',
      user: 'Mike Johnson',
      time: '1 hour ago',
      type: 'user'
    },
    {
      id: 4,
      action: 'Project completed',
      user: 'Sarah Wilson',
      time: '2 hours ago',
      type: 'project'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>
        <div className="text-right">
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
        {stats.map((stat, index) => {
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
                  <div className="flex items-center mt-2">
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === 'positive'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                      from last month
                    </span>
                  </div>
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
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Latest updates from your dashboard
          </p>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {recentActivities.map((activity, index) => (
            <div
              key={activity.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'message'
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : activity.type === 'project'
                      ? 'bg-purple-50 dark:bg-purple-900/20'
                      : 'bg-green-50 dark:bg-green-900/20'
                  }`}>
                    {activity.type === 'message' && (
                      <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    )}
                    {activity.type === 'project' && (
                      <FolderOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    )}
                    {activity.type === 'user' && (
                      <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      by {activity.user}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;