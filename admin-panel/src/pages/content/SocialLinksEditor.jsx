import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, ExternalLink, Eye } from 'lucide-react';
import api from '../../utils/api';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';
import { useToast } from '../../context/ToastContext';

const PLATFORMS = [
  { key: 'GitHub', icon: '🐙', color: 'hover:text-gray-900 dark:hover:text-white' },
  { key: 'LinkedIn', icon: '🔗', color: 'hover:text-blue-600 dark:hover:text-blue-400' },
  { key: 'Twitter', key2: 'X', icon: '𝕏', color: 'hover:text-black dark:hover:text-white' },
  { key: 'Facebook', icon: '📘', color: 'hover:text-blue-500 dark:hover:text-blue-400' },
  { key: 'Instagram', icon: '📷', color: 'hover:text-pink-500 dark:hover:text-pink-400' },
  { key: 'Telegram', icon: '✈️', color: 'hover:text-sky-500 dark:hover:text-sky-400' },
  { key: 'YouTube', icon: '▶️', color: 'hover:text-red-600 dark:hover:text-red-400' },
  { key: 'TikTok', icon: '🎵', color: 'hover:text-black dark:hover:text-white' },
  { key: 'Portfolio Website', icon: '🌐', color: 'hover:text-blue-600 dark:hover:text-blue-400' },
];

const SVG_ICONS = {
  GitHub: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  ),
  LinkedIn: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  ),
  Twitter: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Facebook: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
    </svg>
  ),
  Instagram: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  Telegram: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.888-.662 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),
  YouTube: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  TikTok: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
};

const SocialLinksEditor = () => {
  const { showToast } = useToast();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [customLinks, setCustomLinks] = useState([]);

  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/api/content/social-links');
      if (res.success) {
        const data = res.data || [];
        const known = data.filter(l => PLATFORMS.some(p => p.key === l.platform));
        const custom = data.filter(l => !PLATFORMS.some(p => p.key === l.platform));
        setLinks(known);
        setCustomLinks(custom);
      }
    } catch (err) {
      setError(err.message || 'Failed to load social links');
      showToast('Failed to load social links', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  const getLink = (platform) => links.find(l => l.platform === platform) || { platform, url: '', enabled: true };

  const updateLink = (platform, field, value) => {
    setLinks(prev => {
      const existing = prev.findIndex(l => l.platform === platform);
      if (existing >= 0) {
        return prev.map((l, i) => i === existing ? { ...l, [field]: value } : l);
      }
      return [...prev, { platform, url: '', enabled: true, [field]: value }];
    });
  };

  const addCustomLink = () => {
    setCustomLinks(prev => [...prev, { platform: '', url: '', enabled: true }]);
  };

  const updateCustomLink = (index, field, value) => {
    setCustomLinks(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
  };

  const removeCustomLink = (index) => {
    setCustomLinks(prev => prev.filter((_, i) => i !== index));
  };

  const enabledLinks = () => {
    const all = [...links, ...customLinks].filter(l => l.enabled !== false);
    return all;
  };

  const save = async () => {
    try {
      setSaving(true);
      const allLinks = [...links, ...customLinks];
      await api.put('/api/content/social-links', { socialLinks: allLinks });
      showToast('Social links saved successfully!');
    } catch (err) {
      showToast('Failed to save: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="font-bold">Failed to load social links.</p>
        <p className="text-sm mt-1">{error}</p>
        <button onClick={fetchLinks} className="mt-4 px-5 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors">Retry</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <SectionHeader
        title="Social Links"
        subtitle="Manage all social media links from one place. Changes reflect everywhere automatically."
        onSave={save}
        saving={saving}
      />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3 space-y-6">
          <Card>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Platform Links</h2>
            <div className="space-y-3">
              {PLATFORMS.map((platform) => {
                const link = getLink(platform.key);
                const IconSvg = SVG_ICONS[platform.key];
                return (
                  <div key={platform.key} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm shrink-0 border border-gray-200 dark:border-gray-700">
                      {IconSvg || <span className="text-lg">{platform.icon}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{platform.key2 || platform.key}</p>
                      <input
                        type="text"
                        placeholder={`https://${platform.key.toLowerCase().replace(/\s+/g, '')}.com/username`}
                        value={link.url || ''}
                        onChange={(e) => updateLink(platform.key, 'url', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={link.enabled !== false}
                          onChange={(e) => updateLink(platform.key, 'enabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                        <span className="sr-only">Toggle {platform.key}</span>
                      </label>
                      <a
                        href={link.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${link.url ? platform.color : 'opacity-40 pointer-events-none'}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Custom Links</h2>
              <button
                onClick={addCustomLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Custom
              </button>
            </div>
            {customLinks.length === 0 && (
              <p className="text-sm text-gray-400 italic text-center py-4">No custom links yet. Click "Add Custom" to add one.</p>
            )}
            <div className="space-y-3">
              {customLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Platform name"
                      value={link.platform}
                      onChange={(e) => updateCustomLink(index, 'platform', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm border-gray-200 dark:border-gray-700"
                    />
                  </div>
                  <div className="flex-[2]">
                    <input
                      type="text"
                      placeholder="https://"
                      value={link.url}
                      onChange={(e) => updateCustomLink(index, 'url', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm border-gray-200 dark:border-gray-700"
                    />
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={link.enabled !== false}
                      onChange={(e) => updateCustomLink(index, 'enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                  </label>
                  <button
                    onClick={() => removeCustomLink(index)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="xl:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Live Preview</h2>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Hero Section Preview</p>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 min-h-[60px] flex-wrap">
                  {enabledLinks().length === 0 ? (
                    <span className="text-sm text-gray-400 italic">No enabled social links</span>
                  ) : (
                    enabledLinks().map((link) => {
                      const IconSvg = SVG_ICONS[link.platform];
                      return (
                        <a
                          key={link.platform}
                          href={link.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={link.platform}
                          className="w-9 h-9 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-sm transition-all duration-200"
                        >
                          {IconSvg || <span className="text-xs font-bold">{link.platform[0]}</span>}
                        </a>
                      );
                    })
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Footer Preview</p>
                <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 min-h-[60px] flex-wrap">
                  {enabledLinks().length === 0 ? (
                    <span className="text-sm text-gray-400 italic">No enabled social links</span>
                  ) : (
                    enabledLinks().map((link) => {
                      const IconSvg = SVG_ICONS[link.platform];
                      return (
                        <a
                          key={link.platform}
                          href={link.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={link.platform}
                          className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                        >
                          {IconSvg ? (
                            <span className="w-5 h-5">{IconSvg}</span>
                          ) : (
                            <span className="text-xs font-bold">{link.platform[0]}</span>
                          )}
                        </a>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Centralized Management</p>
                <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">Social links are stored in one place. Hero and Footer sections consume the same data source. Any update here reflects everywhere instantly.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SocialLinksEditor;