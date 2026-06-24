import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useSocketContext } from './SocketContext';
import api from '../utils/api';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocketContext();
  const fetchedRef = useRef(false);

  const fetchNotifications = useCallback(async ({ page = 1, limit = 10, type, search } = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('limit', limit);
      if (type) params.set('type', type);
      if (search) params.set('search', search);

      const res = await api.get(`/api/notifications?${params}`);
      if (res.success) {
        setNotifications(res.data);
        return res;
      }
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await api.get('/api/notifications/unread-count');
      if (res.success) setUnreadCount(res.count);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchUnreadCount();
    }
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => [notification, ...prev]);
    };

    const handleMessageNew = () => {
      fetchUnreadCount();
    };

    const handleProjectCreate = () => {
      fetchUnreadCount();
    };

    socket.on('notification:new', handleNewNotification);
    socket.on('message:new', handleMessageNew);
    socket.on('project:create', handleProjectCreate);

    return () => {
      socket.off('notification:new', handleNewNotification);
      socket.off('message:new', handleMessageNew);
      socket.off('project:create', handleProjectCreate);
    };
  }, [socket, fetchUnreadCount]);

  const markAsRead = useCallback(async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // silent
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const res = await api.put('/api/notifications/read-all');
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch {
      // silent
    }
  }, []);

  const deleteNotification = useCallback(async (id) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications((prev) => {
        const removed = prev.find((n) => n._id === id);
        if (removed && !removed.isRead) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.filter((n) => n._id !== id);
      });
    } catch {
      // silent
    }
  }, []);

  const deleteAllNotifications = useCallback(async (type) => {
    try {
      const params = type ? `?type=${type}` : '';
      const res = await api.delete(`/api/notifications${params}`);
      if (res.success) {
        if (type) {
          setNotifications((prev) => prev.filter((n) => n.type !== type));
        } else {
          setNotifications([]);
        }
        setUnreadCount(0);
      }
    } catch {
      // silent
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        loading,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return ctx;
}
