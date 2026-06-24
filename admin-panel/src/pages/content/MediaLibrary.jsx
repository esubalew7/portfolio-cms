import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Upload, X, ImageIcon, Copy, Trash2, Loader2, RefreshCw, Check, ExternalLink } from 'lucide-react';
import api from '../../utils/api';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';
import { useToast } from '../../context/ToastContext';

const MediaLibrary = () => {
  const { showToast } = useToast();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const fileInputRef = useRef(null);

  const fetchMedia = useCallback(async (q = '', sortBy = sort) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (q) params.set('search', q);
      params.set('sort', sortBy);
      const res = await api.get(`/api/media?${params.toString()}`);
      if (res.success) setMedia(res.data || []);
    } catch {
      showToast('Failed to load media', 'error');
    } finally {
      setLoading(false);
    }
  }, [sort, showToast]);

  useEffect(() => {
    fetchMedia(search, sort);
  }, [sort]);

  useEffect(() => {
    if (!search) { fetchMedia('', sort); return; }
    const timer = setTimeout(() => fetchMedia(search, sort), 300);
    return () => clearTimeout(timer);
  }, [search, sort, fetchMedia]);

  const handleUpload = async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be less than 5MB', 'error');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post('/api/media/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const pct = Math.round((progressEvent.loaded * 100) / (progressEvent.total || file.size));
          setUploadProgress(pct);
        },
      });

      if (res.success) {
        showToast('Image uploaded successfully!');
        fetchMedia(search, sort);
      }
    } catch (err) {
      showToast('Upload failed: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    if (e.target) e.target.value = '';
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file?.type?.startsWith('image/')) handleUpload(file);
  }, [search, sort]);

  const handleCopyUrl = async (item) => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopiedId(item._id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast('Failed to copy URL', 'error');
    }
  };

  const handleDelete = async (item) => {
    try {
      setDeletingId(item._id);
      const res = await api.delete(`/api/media/${item._id}`);
      if (res.success) {
        showToast('Image deleted');
        setMedia((prev) => prev.filter((m) => m._id !== item._id));
        setConfirmDelete(null);
      }
    } catch (err) {
      const msg = err.data?.message || err.message || 'Delete failed';
      if (err.status === 409) {
        showToast('Cannot delete: Image is in use', 'error');
      } else {
        showToast(msg, 'error');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + units[i];
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  return (
    <div className="max-w-6xl">
      <SectionHeader
        title="Media Library"
        subtitle="Upload, manage, and reuse images across your portfolio."
      />

      <div className="space-y-6">
        <Card>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search images..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="-createdAt">Newest</option>
              <option value="createdAt">Oldest</option>
              <option value="name">Name A-Z</option>
              <option value="-name">Name Z-A</option>
              <option value="-fileSize">Largest</option>
              <option value="fileSize">Smallest</option>
            </select>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                disabled={uploading}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {uploading ? `Uploading ${uploadProgress}%` : 'Upload'}
              </button>
            </div>
          </div>

          {uploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">{uploadProgress}%</p>
            </div>
          )}
        </Card>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`
            relative min-h-[300px] rounded-2xl transition-all duration-200
            ${dragOver ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' : ''}
          `}
        >
          {dragOver && (
            <div className="absolute inset-0 z-10 bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <Upload className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">Drop to upload</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
          ) : media.length === 0 ? (
            <Card>
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <ImageIcon className="w-16 h-16 mb-4" />
                <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">No images yet</p>
                <p className="text-sm mt-1 mb-6">Upload your first image to get started</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all"
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {media.map((item) => (
                <Card key={item._id} padding={false} className="group overflow-hidden">
                  <div className="relative aspect-square bg-gray-50 dark:bg-gray-800/50">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleCopyUrl(item)}
                        className="p-2 bg-white/90 hover:bg-white text-gray-800 rounded-lg transition-colors"
                        title="Copy URL"
                      >
                        {copiedId === item._id ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/90 hover:bg-white text-gray-800 rounded-lg transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => setConfirmDelete(item)}
                        className="p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate" title={item.name}>
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      {item.width > 0 && item.height > 0 && (
                        <span>{item.width}x{item.height}</span>
                      )}
                      {item.fileSize > 0 && (
                        <span>{formatSize(item.fileSize)}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400">
                      <span>{formatDate(item.createdAt)}</span>
                      {item.usedBy?.length > 0 && (
                        <span className="text-blue-500 font-medium">Used {item.usedBy.length}x</span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {!loading && media.length > 0 && (
          <p className="text-sm text-gray-400 text-center">
            {media.length} {media.length === 1 ? 'image' : 'images'} total
          </p>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-md p-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Image</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete <strong>{confirmDelete.name}</strong>?
                </p>
              </div>
            </div>
            {confirmDelete.usedBy?.length > 0 && (
              <div className="mb-4 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800">
                <p className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                  This image is used in {confirmDelete.usedBy.length} location(s). Delete it anyway?
                </p>
              </div>
            )}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deletingId === confirmDelete._id}
                className="px-5 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {deletingId === confirmDelete._id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
