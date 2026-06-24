import { MessageSquare, FolderOpen, FileText, Clock, Check, Trash2 } from 'lucide-react';

const TYPE_CONFIG = {
  message: {
    icon: MessageSquare,
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
    label: 'Message',
  },
  project: {
    icon: FolderOpen,
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-600 dark:text-purple-400',
    label: 'Project',
  },
  content: {
    icon: FileText,
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    label: 'Content',
  },
};

function formatTime(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NotificationCard({
  notification,
  onMarkRead,
  onDelete,
  compact = false,
}) {
  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.content;
  const Icon = config.icon;

  return (
    <div
      className={`group relative flex items-start gap-3 px-4 py-3 transition-colors ${
        !notification.isRead
          ? 'bg-blue-50/40 dark:bg-blue-900/5'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
      }`}
    >
      <div className={`p-2 rounded-xl shrink-0 ${config.bg} ${config.text}`}>
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              className={`text-sm leading-snug ${
                !notification.isRead
                  ? 'font-bold text-gray-900 dark:text-white'
                  : 'font-medium text-gray-700 dark:text-gray-300'
              }`}
            >
              {notification.title}
            </p>
            {notification.description && (
              <p className={`text-xs mt-0.5 line-clamp-2 ${
                !notification.isRead
                  ? 'text-gray-600 dark:text-gray-400'
                  : 'text-gray-500 dark:text-gray-500'
              }`}>
                {notification.description}
              </p>
            )}
          </div>

          {!compact && (
            <div className="flex items-center gap-1 shrink-0">
              {!notification.isRead && (
                <button
                  onClick={() => onMarkRead(notification._id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-all"
                  title="Mark as read"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => onDelete(notification._id)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex items-center gap-1 text-[10px] font-medium text-gray-400 dark:text-gray-500">
            <Clock className="w-3 h-3" />
            {formatTime(notification.createdAt)}
          </div>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${config.bg} ${config.text}`}>
            {config.label}
          </span>
        </div>
      </div>

      {!notification.isRead && !compact && (
        <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0" />
      )}
    </div>
  );
}
