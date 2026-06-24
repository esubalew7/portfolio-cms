import { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  MessageSquare,
  FolderOpen,
  FileText,
  Search,
  Trash2,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Filter,
  ChevronDown,
  X,
} from 'lucide-react';
import Card from '../components/ui/Card';
import NotificationCard from '../components/notifications/NotificationCard';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import api from '../utils/api';

const TYPE_OPTIONS = [
  { value: '', label: 'All', icon: Bell },
  { value: 'message', label: 'Messages', icon: MessageSquare },
  { value: 'project', label: 'Projects', icon: FolderOpen },
  { value: 'content', label: 'Content', icon: FileText },
];

const FILTER_OPTIONS = [
  { value: '', label: 'All notifications' },
  { value: 'message', label: 'Messages' },
  { value: 'project', label: 'Projects' },
  { value: 'content', label: 'Content' },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('limit', pagination.limit);
      if (typeFilter) params.set('type', typeFilter);
      if (search) params.set('search', search);
      if (sort === 'oldest') params.set('sort', 'oldest');
      else if (sort === 'unread') params.set('sort', 'unread');

      const res = await api.get(`/api/notifications?${params}`);
      if (res.success) {
        setNotifications(res.data);
        setPagination(res.pagination);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page, pagination.limit, typeFilter, search, sort]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = useCallback(async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch {
      // silent
    }
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await api.put('/api/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // silent
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
    } catch {
      // silent
    }
  }, []);

  const handleDeleteAll = useCallback(async () => {
    try {
      const params = typeFilter ? `?type=${typeFilter}` : '';
      const res = await api.delete(`/api/notifications${params}`);
      if (res.success) {
        setNotifications([]);
        setPagination((prev) => ({ ...prev, total: 0, page: 1 }));
      }
    } catch {
      // silent
    }
  }, [typeFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const clearSearch = () => {
    setSearch('');
    setPage(1);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Notifications</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {pagination.total} notification{pagination.total !== 1 ? 's' : ''}
          {unreadCount > 0 && ` (${unreadCount} unread)`}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notifications..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-gray-100 dark:bg-gray-800/60 border border-transparent focus:border-gray-300 dark:focus:border-gray-600 rounded-xl outline-none text-gray-900 dark:text-white placeholder-gray-400 transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Filter */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 dark:bg-gray-800/60 rounded-xl p-0.5">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setTypeFilter(opt.value); setPage(1); }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    typeFilter === opt.value
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Mobile filter */}
            <div className="sm:hidden relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/60 rounded-xl"
              >
                <Filter className="w-3.5 h-3.5" />
                {FILTER_OPTIONS.find((o) => o.value === typeFilter)?.label || 'Filter'}
                <ChevronDown className="w-3 h-3" />
              </button>
              {showFilter && (
                <div className="absolute right-0 top-9 w-40 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-20">
                  {FILTER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setTypeFilter(opt.value); setPage(1); setShowFilter(false); }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                        typeFilter === opt.value
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="px-3 py-2 text-xs font-medium bg-gray-100 dark:bg-gray-800/60 border border-transparent rounded-xl outline-none text-gray-500 dark:text-gray-400 cursor-pointer"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="unread">Unread first</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={() => setConfirmDeleteAll(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete {typeFilter ? FILTER_OPTIONS.find((o) => o.value === typeFilter)?.label : 'all'}
            </button>
          )}
        </div>
      </div>

      {/* Notification List */}
      <Card padding={false} className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Bell className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No notifications found</p>
            {search && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Try a different search or clear filters
              </p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {notifications.map((notif) => (
              <NotificationCard
                key={notif._id}
                notification={notif}
                onMarkRead={handleMarkAsRead}
                onDelete={() => setConfirmDelete(notif._id)}
              />
            ))}
          </div>
        )}
      </Card>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1)
              .filter((p) => {
                const cur = pagination.page;
                return p === 1 || p === pagination.pages || (p >= cur - 1 && p <= cur + 1);
              })
              .map((p, idx, arr) => (
                <span key={p} className="flex items-center">
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="px-1 text-gray-400 text-xs">...</span>
                  )}
                  <button
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 text-xs font-medium rounded-xl transition-colors ${
                      p === pagination.page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {p}
                  </button>
                </span>
              ))}
            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page >= pagination.pages}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setConfirmDelete(null)}
          onConfirm={() => handleDelete(confirmDelete)}
          title="Delete notification?"
          message="This action cannot be undone."
          confirmText="Delete"
          type="danger"
        />
      )}

      {confirmDeleteAll && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setConfirmDeleteAll(false)}
          onConfirm={handleDeleteAll}
          title={`Delete ${typeFilter ? FILTER_OPTIONS.find((o) => o.value === typeFilter)?.label + ' ' : ''}notifications?`}
          message={`This will permanently delete all${typeFilter ? ' ' + FILTER_OPTIONS.find((o) => o.value === typeFilter)?.label.toLowerCase() : ''} notifications. This action cannot be undone.`}
          confirmText="Delete all"
          type="danger"
        />
      )}
    </div>
  );
}
