import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  FolderOpen,
  BarChart3,
  FileText,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  User,
  Bell,
  RefreshCw,
  Clock
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  // DEBUG LOG
  useEffect(() => {
    console.log("NOTIFICATIONS STATE:", { open, unreadCount, count: notifications.length });
  }, [open, notifications, unreadCount]);

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const [notifRes, countRes] = await Promise.all([
        api.get('/api/notifications'),
        api.get('/api/notifications/unread-count')
      ]);
      
      if (notifRes.success) setNotifications(notifRes.data);
      if (countRes.success) setUnreadCount(countRes.count);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleMarkAsRead = async (id, type) => {
    try {
      // Find the notification in state
      const notif = notifications.find(n => n._id === id);
      
      // Navigate based on type
      if (type === 'message') {
        navigate('/dashboard/messages');
      } else if (type === 'project') {
        navigate('/dashboard/projects');
      }

      // Close dropdown
      setOpen(false);

      if (!notif || notif.isRead) return;

      const res = await api.put(`/api/notifications/${id}/read`);
      
      if (res.success) {
        // Update local state
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const fetchAdminInfo = async () => {
    try {
      const res = await api.get('/api/auth/me');
      if (res.success) {
        setAdmin(res.data);
      }
    } catch (error) {
      console.error('Error fetching admin info:', error);
      // If unauthorized, logout
      if (error.status === 401) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchAdminInfo();
    // Refresh notifications every 2 minutes
    const interval = setInterval(fetchNotifications, 120000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & Analytics'
    },
    {
      path: '/dashboard/analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Visitor Analytics'
    },
    {
      path: '/dashboard/projects',
      label: 'Projects',
      icon: FolderOpen,
      description: 'Manage Projects'
    },
    {
      path: '/dashboard/messages',
      label: 'Messages',
      icon: MessageSquare,
      description: 'Contact Messages'
    },
    {
      path: '/dashboard/content',
      label: 'Content',
      icon: FileText,
      description: 'Manage Portfolio Content'
    }
  ];

  const handleLogout = () => {
    // Clear the JWT token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/login');
  };

  const isActiveRoute = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 bg-white dark:bg-gray-900 shadow-2xl border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                <p className="text-sm text-blue-100">Portfolio Manager</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 text-white lg:hidden transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActiveRoute(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-4 py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] ${
                    active
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600 dark:border-blue-400 shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <div className={`p-2 rounded-lg mr-4 transition-colors duration-200 ${
                    active
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                  }`}>
                    <Icon className={`h-5 w-5 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold block">{item.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.description}</span>
                  </div>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-2">
            <button
              onClick={toggleTheme}
              className="flex items-center w-full px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200"
            >
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 mr-4">
                {isDarkMode ? (
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <span className="font-medium">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
            >
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 mr-4">
                <LogOut className="h-4 w-4" />
              </div>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navbar */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden transition-colors duration-200"
              >
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>

              <div className="hidden sm:block">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {menuItems.find(item => isActiveRoute(item.path))?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {menuItems.find(item => isActiveRoute(item.path))?.description || 'Welcome to your admin panel'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => {
                    console.log("Toggling notifications dropdown. Current state:", !open);
                    setOpen(!open);
                  }}
                  className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-colors duration-200 ${open ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                  aria-label="Toggle notifications"
                >
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {open && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div 
                      className="fixed inset-0 z-40 bg-transparent" 
                      onClick={() => setOpen(false)}
                    ></div>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden transform origin-top-right transition-all duration-200">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                        <span className="text-xs font-medium px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                          {unreadCount} Unread
                        </span>
                      </div>
                      
                      <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                        {Array.isArray(notifications) && notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div 
                              key={notif._id}
                              onClick={() => {
                                console.log("Notification clicked:", notif._id);
                                handleMarkAsRead(notif._id, notif.type);
                              }}
                              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-pointer relative ${
                                !notif.isRead 
                                  ? 'bg-blue-50/40 dark:bg-blue-900/10' 
                                  : 'opacity-70 grayscale-[0.5]'
                              }`}
                            >
                              {!notif.isRead && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 dark:bg-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.5)]"></div>
                              )}
                              <div className="flex gap-3">
                                <div className={`p-2 rounded-lg h-fit transition-colors ${
                                  notif.type === 'message' 
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                } ${!notif.isRead ? 'scale-110 shadow-sm' : ''}`}>
                                  {notif.type === 'message' ? <MessageSquare className="h-4 w-4" /> : <FolderOpen className="h-4 w-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm transition-all truncate ${!notif.isRead ? 'font-extrabold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                                    {notif.title}
                                  </p>
                                  <p className={`text-xs transition-all line-clamp-1 mb-1 ${!notif.isRead ? 'text-gray-800 dark:text-gray-200 font-medium' : 'text-gray-500 dark:text-gray-500'}`}>
                                    {notif.description}
                                  </p>
                                  <div className="flex items-center text-[10px] font-medium text-gray-400 dark:text-gray-600">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {formatRelativeTime(notif.createdAt)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                            <p className="text-sm font-medium">No notifications yet</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 text-center">
                        <button 
                          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                          onClick={() => {
                            setOpen(false);
                            navigate('/dashboard/messages');
                          }}
                        >
                          View all messages
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Admin info */}
              <div className="relative flex items-center pl-4 border-l border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                  className="flex items-center space-x-3 focus:outline-none group"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {admin ? 'Admin' : 'Loading...'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {admin?.email || 'admin@portfolio.com'}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all">
                    <User className="h-5 w-5 text-white" />
                  </div>
                </button>

                {/* Admin Dropdown */}
                {adminDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 bg-transparent" 
                      onClick={() => setAdminDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden transform origin-top-right transition-all animate-in fade-in zoom-in duration-200">
                      <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 text-center">
                        <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-md mb-3">
                          <User className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Portfolio Admin</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{admin?.email}</p>
                      </div>
                      
                      <div className="p-2">
                        <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account Info</div>
                        <div className="px-4 py-2 space-y-3">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Clock className="h-4 w-4 mr-3 text-blue-500" />
                            <span>Joined {admin ? new Date(admin.createdAt).toLocaleDateString() : '...'}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <RefreshCw className="h-4 w-4 mr-3 text-purple-500" />
                            <span>Last login: Today</span>
                          </div>
                        </div>
                        
                        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;