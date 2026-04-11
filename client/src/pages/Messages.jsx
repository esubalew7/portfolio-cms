import { useState, useEffect, useMemo } from 'react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { 
  Trash2, 
  Mail, 
  MailOpen, 
  Clock, 
  User, 
  ChevronRight,
  Filter
} from 'lucide-react';

// UI Components
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmationModal from '../components/ui/ConfirmationModal';

// Dashboard Components
import PageHeader from '../components/dashboard/PageHeader';
import DashboardTable from '../components/dashboard/DashboardTable';

// Utils
import { formatDate, normalizedText } from '../utils/dashboardUtils';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    
    const { showToast } = useToast();

    // Fetch Messages
    const fetchMessages = async () => {
        try {
            setLoading(true);
            const data = await api.get('/api/contact');
            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            showToast(error.message || 'Failed to fetch messages', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    // Filter Logic
    const filteredMessages = useMemo(() => {
        return messages.filter(msg => 
            [msg.name, msg.email, msg.subject, msg.message]
                .some(field => normalizedText(field).toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [messages, searchTerm]);

    // Handlers
    const handleViewMessage = (message) => {
        setSelectedMessage(message);
    };

    const handleDeleteMessage = async () => {
        if (!messageToDelete) return;
        try {
            setSubmitting(true);
            await api.delete(`/api/contact/${messageToDelete._id || messageToDelete.id}`);
            setMessages(prev => prev.filter(m => (m._id !== messageToDelete._id && m.id !== messageToDelete.id)));
            showToast('Message deleted successfully');
        } catch (error) {
            showToast(error.message || 'Failed to delete message', 'error');
        } finally {
            setSubmitting(false);
            setMessageToDelete(null);
        }
    };

    // Table Columns
    const columns = [
        {
            label: 'Contact',
            className: 'w-1/4',
            render: (m) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                        {m.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-gray-900 dark:text-white truncate">{m.name}</p>
                        <p className="text-xs text-gray-500 truncate">{m.email}</p>
                    </div>
                </div>
            )
        },
        {
            label: 'Subject & Preview',
            className: 'w-1/3',
            render: (m) => (
                <div className="min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{m.subject || 'No Subject'}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{m.message}</p>
                </div>
            )
        },
        {
            label: 'Date',
            render: (m) => (
                <div className="flex items-center gap-2 text-gray-500">
                    <Clock size={14} />
                    <span className="text-xs">{formatDate(m.createdAt)}</span>
                </div>
            )
        },
        {
            label: 'Actions',
            className: 'text-right',
            render: (m) => (
                <div className="flex justify-end gap-1">
                    <Button variant="ghost" icon={ChevronRight} onClick={() => handleViewMessage(m)} className="p-2" />
                    <Button 
                        variant="ghost" 
                        icon={Trash2} 
                        onClick={() => { setMessageToDelete(m); setShowDeleteModal(true); }} 
                        className="p-2 text-gray-400 hover:text-red-500" 
                    />
                </div>
            )
        }
    ];

    return (
        <div className="animate-in fade-in duration-500 font-sans">
            <PageHeader 
                title="Messages"
                subtitle={`Inquiries from your contact form (${filteredMessages.length})`}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchPlaceholder="Search by name, email, or message content..."
            />

            <DashboardTable 
                columns={columns}
                data={filteredMessages}
                loading={loading}
                searchTerm={searchTerm}
                emptyMessage="No one has reached out yet. Your inbox is clean!"
            />

            {/* View Message Modal */}
            <Modal
                isOpen={!!selectedMessage}
                onClose={() => setSelectedMessage(null)}
                title="Message Details"
                maxWidth="max-w-xl"
            >
                {selectedMessage && (
                    <div className="space-y-6">
                        <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl">
                                    {selectedMessage.name?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{selectedMessage.name}</h4>
                                    <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Received</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(selectedMessage.createdAt)}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Subject</h5>
                            <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white font-semibold">
                                {selectedMessage.subject || 'No Subject Provided'}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Message Body</h5>
                            <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {selectedMessage.message}
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button variant="secondary" className="flex-1" onClick={() => setSelectedMessage(null)}>Close</Button>
                            <a href={`mailto:${selectedMessage.email}`} className="flex-1">
                                <Button variant="primary" icon={Mail} className="w-full">Reply via Email</Button>
                            </a>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmationModal 
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteMessage}
                loading={submitting}
                title="Delete Message"
                message="Are you sure you want to delete this message? This action is permanent."
            />
        </div>
    );
};

export default Messages;
