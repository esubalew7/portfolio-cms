import { useState, useEffect, useCallback } from 'react';
import { Search, X, Check, ImageIcon, Loader2 } from 'lucide-react';
import api from '../../../utils/api';

const MediaSelectorModal = ({ open, onClose, onSelect }) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchMedia = useCallback(async (q = '') => {
    try {
      setLoading(true);
      const params = q ? `/api/media/search?q=${encodeURIComponent(q)}` : '/api/media';
      const res = await api.get(params);
      if (res.success) setMedia(res.data || []);
    } catch {
      setMedia([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      setSelected(null);
      setSearch('');
      fetchMedia();
    }
  }, [open, fetchMedia]);

  useEffect(() => {
    if (!search) { fetchMedia(); return; }
    const timer = setTimeout(() => fetchMedia(search), 300);
    return () => clearTimeout(timer);
  }, [search, fetchMedia]);

  const handleSelect = (item) => {
    setSelected(item._id === selected?._id ? null : item);
  };

  const handleInsert = () => {
    if (selected) {
      onSelect(selected.url);
      onClose();
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '';
    const units = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + units[i];
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-3xl max-h-[85vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Select Image</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search images..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : media.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <ImageIcon className="w-12 h-12 mb-3" />
              <p className="text-sm font-medium">No images found</p>
              <p className="text-xs mt-1">Upload images first from the Media Library</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {media.map((item) => {
                const isSelected = selected?._id === item._id;
                return (
                  <button
                    key={item._id}
                    onClick={() => handleSelect(item)}
                    className={`
                      relative group aspect-square rounded-xl overflow-hidden border-2 transition-all duration-150
                      ${isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-md'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                      }
                    `}
                  >
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2">
                      <p className="text-[10px] text-white truncate font-medium">{item.name}</p>
                      <p className="text-[9px] text-white/70">{formatSize(item.fileSize)}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-800 shrink-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selected ? `Selected: ${selected.name}` : 'No image selected'}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleInsert}
              disabled={!selected}
              className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Insert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaSelectorModal;
