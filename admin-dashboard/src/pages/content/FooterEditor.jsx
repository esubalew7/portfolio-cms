import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { useContentSection } from '../../hooks/useContentSection';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';
import FormInput from '../../components/ui/FormInput';

const SOCIAL_PLATFORMS = ['GitHub', 'LinkedIn', 'Telegram', 'Facebook', 'Twitter', 'Instagram'];

const FooterEditor = () => {
  const { data, allContent, loading, saving, error, update, save, refetch } = useContentSection('footer');

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
        <p className="font-bold">Failed to load footer settings.</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={refetch}
          className="mt-4 px-5 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const d = data || { socials: [] };

  const set = (field, value) => {
    update({ ...d, [field]: value });
  };

  const socials = d.socials || [];

  const getSocialUrl = (platform) => {
    const existing = socials.find((s) => s.platform === platform);
    return existing ? existing.url : '';
  };

  const setSocialUrl = (platform, url) => {
    const existing = socials.findIndex((s) => s.platform === platform);
    let updated;
    if (existing >= 0) {
      updated = socials.map((s) => (s.platform === platform ? { ...s, url } : s));
    } else {
      updated = [...socials, { platform, url }];
    }
    set('socials', updated);
  };

  const removeSocial = (platform) => {
    const updated = socials.filter((s) => s.platform !== platform);
    set('socials', updated);
  };

  const customSocials = socials.filter((s) => !SOCIAL_PLATFORMS.includes(s.platform));

  const addCustomSocial = () => {
    const updated = [...socials, { platform: '', url: '' }];
    set('socials', updated);
  };

  const updateCustomSocial = (index, field, value) => {
    const customList = socials.filter((s) => !SOCIAL_PLATFORMS.includes(s.platform));
    if (customList[index]) {
      customList[index][field] = value;
      const nonCustom = socials.filter((s) => SOCIAL_PLATFORMS.includes(s.platform));
      set('socials', [...nonCustom, ...customList]);
    }
  };

  const removeCustomSocial = (index) => {
    const customList = socials.filter((s) => !SOCIAL_PLATFORMS.includes(s.platform));
    customList.splice(index, 1);
    const nonCustom = socials.filter((s) => SOCIAL_PLATFORMS.includes(s.platform));
    set('socials', [...nonCustom, ...customList]);
  };

  return (
    <div>
      <SectionHeader
        title="Footer Editor"
        subtitle="Manage copyright text and social media links. Footer name is synced from Hero section."
        onSave={save}
        saving={saving}
      />

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Content</h2>
          <div className="flex items-center gap-3 p-4 mb-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Footer Name</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {allContent?.hero?.name || 'Esubalew'}
              </p>
              <p className="text-xs text-blue-500 dark:text-blue-400 mt-0.5">
                Synced from Hero section name
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Copyright Text"
              placeholder="All rights reserved."
              value={d.copyright || ''}
              onChange={(e) => set('copyright', e.target.value)}
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Social Links</h2>
          <div className="space-y-4">
            {SOCIAL_PLATFORMS.map((platform) => (
              <div key={platform} className="flex items-center gap-3">
                <div className="w-24 shrink-0">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{platform}</span>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={`https://${platform.toLowerCase()}.com/username`}
                    value={getSocialUrl(platform)}
                    onChange={(e) => setSocialUrl(platform, e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSocial(platform)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Remove link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Custom Links</h3>
                <button
                  type="button"
                  onClick={addCustomSocial}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Custom
                </button>
              </div>
              {customSocials.length === 0 && (
                <p className="text-sm text-gray-400 italic text-center py-4">
                  No custom links yet. Click "Add Custom" to add one.
                </p>
              )}
              {customSocials.map((social, index) => (
                <div key={index} className="flex items-center gap-3 mb-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Platform name"
                      value={social.platform}
                      onChange={(e) => updateCustomSocial(index, 'platform', e.target.value)}
                      className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                    />
                  </div>
                  <div className="flex-[2]">
                    <input
                      type="text"
                      placeholder="https://"
                      value={social.url}
                      onChange={(e) => updateCustomSocial(index, 'url', e.target.value)}
                      className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCustomSocial(index)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FooterEditor;