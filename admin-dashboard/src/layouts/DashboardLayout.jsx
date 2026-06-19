import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import api from '../utils/api';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [admin, setAdmin] = useState(null);

  const fetchNotifications = async () => {
    try {
      const countRes = await api.get('/api/notifications/unread-count');
      if (countRes.success) setUnreadCount(countRes.count);
    } catch {
      // silently fail
    }
  };

  const fetchAdminInfo = async () => {
    try {
      const res = await api.get('/api/auth/me');
      if (res.success) setAdmin(res.data);
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchAdminInfo();
    const interval = setInterval(fetchNotifications, 120000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        admin={admin}
      />

      {/* Main content — offset by sidebar width on desktop */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          unreadCount={unreadCount}
          admin={admin}
        />

        {/* Page content — scrolls independently */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
