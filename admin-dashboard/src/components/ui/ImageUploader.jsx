import { useState, useRef, useCallback } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import api from '../../utils/api';
import MediaSelectorModal from '../dashboard/media/MediaSelectorModal';

const ImageUploader = ({ value, onChange, label, error }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || null);
  const [dragOver, setDragOver] = useState(false);
  const [showMediaLib, setShowMediaLib] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setPreview(URL.createObjectURL(file));

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/api/upload', formData);
      onChange(res.imageUrl);
    } catch (err) {
      setPreview(value || null);
    } finally {
      setUploading(false);
    }
  };

  const handleSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file?.type?.startsWith('image/')) {
      handleFile(file);
    }
  }, [value, onChange]);

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleMediaSelect = (url) => {
    setPreview(url);
    onChange(url);
  };

  const currentPreview = preview || value;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="flex flex-col gap-3">
        {currentPreview && (
          <div className="relative group w-full aspect-video rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <img src={currentPreview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="p-2 bg-white/90 hover:bg-white text-gray-800 rounded-xl transition-colors"
                title="Replace image"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowMediaLib(true)}
                className="p-2 bg-white/90 hover:bg-white text-gray-800 rounded-xl transition-colors"
                title="Choose from Media Library"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                className="p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-xl transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <label
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`
              flex-1 flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all
              ${dragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : ''}
              border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10
              ${uploading ? 'opacity-50 pointer-events-none' : ''}
              ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : ''}
            `}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-medium text-gray-500">Uploading...</p>
                </div>
              ) : (
                <>
                  <Upload className={`h-8 w-8 mb-2 ${error ? 'text-red-500' : 'text-gray-400'}`} />
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    <span className="text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG or WEBP (MAX. 5MB)</p>
                </>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleSelect}
              disabled={uploading}
            />
          </label>

          <button
            type="button"
            onClick={() => setShowMediaLib(true)}
            className="flex flex-col items-center justify-center h-32 w-24 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all cursor-pointer shrink-0"
          >
            <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 text-center leading-tight px-1">
              Media Library
            </span>
          </button>
        </div>

        {error && <p className="text-xs font-semibold text-red-500">{error}</p>}
      </div>

      <MediaSelectorModal
        open={showMediaLib}
        onClose={() => setShowMediaLib(false)}
        onSelect={handleMediaSelect}
      />
    </div>
  );
};

export default ImageUploader;
