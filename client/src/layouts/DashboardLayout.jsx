import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  FolderOpen,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  User,
  Bell,
  Settings
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & Analytics'
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
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-colors duration-200">
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
              </button>

              {/* Settings */}
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Admin info */}
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    admin@portfolio.com
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
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