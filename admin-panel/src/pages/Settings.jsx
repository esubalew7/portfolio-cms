import { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Bell, Shield, Mail, User, Camera, Save, RefreshCw } from 'lucide-react';
import Card from '../components/ui/Card';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

const Settings = () => {
  const { showToast } = useToast();
  const { isDarkMode, toggleTheme } = useTheme();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({ name: '', role: '', email: '' });
  const [profileImage, setProfileImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/auth/me');
        if (res.success) {
          setProfile({
            name: res.data.name || '',
            role: res.data.role || '',
            email: res.data.email || '',
          });
          setProfileImage(res.data.profileImage || '');
        }
      } catch (err) {
        showToast('Failed to load profile', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [showToast]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result || '');
    reader.readAsDataURL(file);
  };

  const handleUploadImage = async () => {
    if (!imageFile) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', imageFile);
      const res = await api.post('/api/auth/profile/image', formData);
      if (res.success) {
        setProfileImage(res.data.profileImage);
        setImageFile(null);
        setImagePreview('');
        showToast('Profile picture updated!');
      }
    } catch (err) {
      showToast('Failed to upload image: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const res = await api.put('/api/auth/profile', {
        name: profile.name,
        role: profile.role,
      });
      if (res.success) {
        showToast('Profile saved!');
        setProfile((prev) => ({ ...prev, name: res.data.name, role: res.data.role }));
      }
    } catch (err) {
      showToast('Failed to save: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const avatarSrc = imagePreview || profileImage;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your profile and preferences.</p>
      </div>

      {/* Profile */}
      <Card>
        <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Profile</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Update your personal information.</p>
        </div>

        <div className="mt-6 space-y-6">
          {/* Avatar upload */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-gray-100 dark:ring-gray-800 overflow-hidden">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
                ) : (
                  profile.name ? profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'A'
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Profile Picture</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">JPG, PNG or WebP. 1:1 ratio recommended.</p>
              {imageFile && (
                <button
                  onClick={handleUploadImage}
                  disabled={uploading}
                  className="mt-2 px-4 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  {uploading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                  {uploading ? 'Uploading...' : 'Save Image'}
                </button>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              placeholder="Your name"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Role / Title</label>
            <input
              type="text"
              value={profile.role}
              onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
              placeholder="e.g. Full Stack Developer"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card>
        <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Appearance</h2>
        </div>
        <div className="mt-4 flex items-center justify-between py-2">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Theme</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Toggle between light and dark mode</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Notifications</h2>
        </div>
        <div className="mt-2 divide-y divide-gray-100 dark:divide-gray-800">
          {[
            { icon: Bell, label: 'Email Notifications', desc: 'Receive email for new messages and projects', enabled: false },
            { icon: Shield, label: 'Security Alerts', desc: 'Get notified about suspicious login attempts', enabled: true },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between py-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${item.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${item.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Account */}
      <Card>
        <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Account</h2>
        </div>
        <div className="mt-2 py-4 flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
              <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Email Address</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Your admin account email</p>
            </div>
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{profile.email}</span>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
