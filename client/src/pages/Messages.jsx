import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { 
  Mail, 
  Clock, 
  Loader2,
  Inbox,
  Trash2,
  Eye
} from 'lucide-react';

// UI Components
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmationModal from '../components/ui/ConfirmationModal';

// Dashboard Components
import PageHeader from '../components/dashboard/PageHeader';

// Utils
import { formatDate } from '../utils/dashboardUtils';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    
    const { showToast } = useToast();
    const unreadCount = messages.filter((msg) => !msg?.isRead).length;

    const getMessagePreview = (text) => {
        if (!text) return '';
        return text.length > 50 ? `${text.slice(0, 50)}...` : text;
    };

    // Fetch messages when dashboard page loads
    const fetchMessages = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.get('/api/contact');
            const fetchedMessages = Array.isArray(data)
                ? data
                : Array.isArray(data?.data)
                    ? data.data
                    : [];
            setMessages(fetchedMessages);
        } catch (error) {
            showToast(error.message || 'Failed to fetch messages', 'error');
            setMessages([]);
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleViewMessage = (message) => {
        setSelectedMessage(message);
        if (!message?.isRead) {
            markMessageAsRead(message);
        }
    };

    const markMessageAsRead = async (message) => {
        const messageId = message?._id || message?.id;
        if (!messageId) return;

        // Optimistic UI update for instant feedback
        setMessages((prev) =>
            prev.map((msg) =>
                (msg._id || msg.id) === messageId ? { ...msg, isRead: true } : msg
            )
        );

        try {
            await api.put(`/api/contact/${messageId}/read`);
        } catch (error) {
            // Revert on failure
            setMessages((prev) =>
                prev.map((msg) =>
                    (msg._id || msg.id) === messageId ? { ...msg, isRead: false } : msg
                )
            );
            showToast(error.message || 'Failed to update read status', 'error');
        }
    };

    const handleAskDeleteMessage = (message) => {
        setMessageToDelete(message);
        setShowDeleteModal(true);
    };

    const handleDeleteMessage = async () => {
        if (!messageToDelete?._id && !messageToDelete?.id) return;

        const messageId = messageToDelete._id || messageToDelete.id;
        try {
            setDeleting(true);
            await api.delete(`/api/contact/${messageId}`);

            setMessages((prev) => prev.filter((msg) => (msg._id || msg.id) !== messageId));
            setShowDeleteModal(false);
            setMessageToDelete(null);

            if (selectedMessage && (selectedMessage._id || selectedMessage.id) === messageId) {
                setSelectedMessage(null);
            }

            showToast('Message deleted successfully');
        } catch (error) {
            showToast(error.message || 'Failed to delete message', 'error');
            throw error;
        } finally {
            setDeleting(false);
        }
    };

    const getReplyMailtoLink = (email) => {
        const subject = encodeURIComponent('Response from Portfolio');
        const body = encodeURIComponent('Hello,\n\nThank you for reaching out.\n\nBest regards,');
        return `mailto:${email}?subject=${subject}&body=${body}`;
    };

    return (
        <div className="animate-in fade-in duration-500 font-sans">
            <PageHeader 
                title="Messages"
                subtitle={`${messages.length} total messages • ${unreadCount} unread`}
            />

            {loading ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-12">
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <p>Loading messages...</p>
                    </div>
                </div>
            ) : messages.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-12">
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full">
                            <Inbox className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-white">No messages</p>
                        <p className="text-sm">No one has reached out yet.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {messages.map((msg, idx) => (
                        <div
                            key={msg._id || msg.id || idx}
                            className={`group relative rounded-2xl border p-5 lg:p-6 cursor-pointer transition-all duration-300 ${
                                msg.isRead
                                    ? 'bg-white/95 dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-0.5'
                                    : 'bg-white dark:bg-gray-900 border-blue-200/80 dark:border-blue-700/40 shadow-md shadow-blue-100/70 dark:shadow-none hover:shadow-xl hover:shadow-blue-100/70 dark:hover:shadow-none hover:-translate-y-1'
                            }`}
                            onClick={() => handleViewMessage(msg)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleViewMessage(msg);
                                }
                            }}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2.5">
                                        {!msg.isRead && <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />}
                                        <p className={`truncate text-[15px] ${msg.isRead ? 'font-semibold text-gray-900 dark:text-white' : 'font-bold text-gray-900 dark:text-white'}`}>
                                            {msg.name || 'Unknown'}
                                        </p>
                                        <span
                                            className={`text-[10px] px-2.5 py-1 rounded-full uppercase tracking-[0.08em] font-bold ${
                                                msg.isRead
                                                    ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 ring-1 ring-blue-200/70 dark:ring-blue-800/50'
                                            }`}
                                        >
                                            {msg.isRead ? 'Read' : 'Unread'}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500 truncate">{msg.email || 'No email'}</p>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 shrink-0">
                                    <Clock size={14} />
                                    <span>{formatDate(msg.createdAt)}</span>
                                </div>
                            </div>

                            <p className={`mt-5 text-sm leading-relaxed min-h-[44px] ${msg.isRead ? 'text-gray-600 dark:text-gray-300' : 'font-semibold text-gray-800 dark:text-gray-100'}`}>
                                {getMessagePreview(msg.message)}
                            </p>

                            <div className="mt-5 grid grid-cols-3 gap-2">
                                <Button
                                    variant="secondary"
                                    icon={Eye}
                                    className="w-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewMessage(msg);
                                    }}
                                >
                                    View
                                </Button>
                                <a href={`mailto:${msg.email}`} className="w-full">
                                    <Button
                                        variant="secondary"
                                        icon={Mail}
                                        className="w-full"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Reply
                                    </Button>
                                </a>
                                <Button
                                    variant="danger"
                                    icon={Trash2}
                                    className="w-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAskDeleteMessage(msg);
                                    }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* View Message Modal */}
            <Modal
                isOpen={!!selectedMessage}
                onClose={() => setSelectedMessage(null)}
                title="Message Details"
                maxWidth="max-w-xl"
            >
                {selectedMessage && (
                    <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
                        <div className="flex items-start justify-between p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl">
                                    {selectedMessage.name?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{selectedMessage.name}</h4>
                                    <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                        <Mail size={14} />
                                        {selectedMessage.email}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Received</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(selectedMessage.createdAt)}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Full Message</h5>
                            <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap max-h-[42vh] overflow-y-auto">
                                {selectedMessage.message}
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button variant="secondary" className="flex-1" onClick={() => setSelectedMessage(null)}>Close</Button>
                            <a
                                href={getReplyMailtoLink(selectedMessage.email)}
                                className="flex-1"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="primary" icon={Mail} className="w-full">
                                    Reply via Email
                                </Button>
                            </a>
                        </div>
                    </div>
                )}
            </Modal>

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => {
                    if (!deleting) {
                        setShowDeleteModal(false);
                        setMessageToDelete(null);
                    }
                }}
                onConfirm={handleDeleteMessage}
                loading={deleting}
                title="Delete Message"
                message="Are you sure you want to delete this message? This action cannot be undone."
                confirmText="Delete Message"
                cancelText="Keep Message"
                type="danger"
            />
        </div>
    );
};

export default Messages;
