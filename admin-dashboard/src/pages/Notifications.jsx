import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MessageSquare, FolderOpen, Clock, RefreshCw } from 'lucide-react';
import Card from '../components/ui/Card';
import { useSocketContext } from '../context/SocketContext';
import api from '../utils/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { socket } = useSocketContext();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/notifications');
      if (res.success) setNotifications(res.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!socket) return;

    const refresh = () => fetchNotifications();
    socket.on('message:new', refresh);
    socket.on('project:create', refresh);

    return () => {
      socket.off('message:new', refresh);
      socket.off('project:create', refresh);
    };
  }, [socket, fetchNotifications]);

  const handleMarkAsRead = async (id, type) => {
    try {
      if (type === 'message') navigate('/dashboard/messages');
      else if (type === 'project') navigate('/dashboard/projects');
      await api.put(`/api/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch {
      // silently fail
    }
  };

  const formatTime = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Notifications</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Stay updated with your portfolio activity.</p>
      </div>

      <Card className="max-w-2xl">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {notifications.map((notif) => (
              <button
                key={notif._id}
                onClick={() => handleMarkAsRead(notif._id, notif.type)}
                className={`w-full text-left px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-start gap-4 ${
                  !notif.isRead ? 'bg-blue-50/30 dark:bg-blue-900/5' : ''
                }`}
              >
                <div className={`p-2 rounded-xl ${
                  notif.type === 'message'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                }`}>
                  {notif.type === 'message' ? <MessageSquare className="w-4 h-4" /> : <FolderOpen className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notif.isRead ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{notif.description}</p>
                  <div className="flex items-center gap-1 mt-1.5 text-[10px] font-medium text-gray-400 dark:text-gray-500">
                    <Clock className="w-3 h-3" />
                    {formatTime(notif.createdAt)}
                  </div>
                </div>
                {!notif.isRead && <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Notifications;
