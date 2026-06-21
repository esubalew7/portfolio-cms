import { RefreshCw } from 'lucide-react';
import { useContentSection } from '../../hooks/useContentSection';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';
import FormInput from '../../components/ui/FormInput';
import ImageUploader from '../../components/ui/ImageUploader';

const ALL_SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'contact', label: 'Contact' },
];

const NavbarEditor = () => {
  const { data, allContent, loading, saving, error, update, save, refetch } = useContentSection('navbar');

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
        <p className="font-bold">Failed to load navbar settings.</p>
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

  const d = data || { navItems: [] };

  const set = (field, value) => {
    update({ ...d, [field]: value });
  };

  const currentNavItems = d.navItems || [];

  const mergedNavItems = ALL_SECTIONS.map((section) => {
    const existing = currentNavItems.find((item) => item.id === section.id);
    return existing || { id: section.id, label: section.label, visible: true };
  });

  const toggleVisibility = (id) => {
    const updated = mergedNavItems.map((item) =>
      item.id === id ? { ...item, visible: !item.visible } : item
    );
    set('navItems', updated);
  };

  const updateLabel = (id, label) => {
    const updated = mergedNavItems.map((item) =>
      item.id === id ? { ...item, label } : item
    );
    set('navItems', updated);
  };

  return (
    <div>
      <SectionHeader
        title="Navbar Editor"
        subtitle="Control logo, resume link, and navigation visibility. Brand name is synced from Hero section."
        onSave={save}
        saving={saving}
      />

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Branding</h2>
          <div className="flex items-center gap-3 p-4 mb-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Brand Name</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {allContent?.hero?.name || 'Esubalew'}
              </p>
              <p className="text-xs text-blue-500 dark:text-blue-400 mt-0.5">
                Synced from Hero section name
              </p>
            </div>
          </div>
          <div className="mt-4">
            <ImageUploader
              label="Brand Logo"
              value={d.logo || ''}
              onChange={(url) => set('logo', url)}
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Resume Button</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Button Text"
              value={d.resumeText || ''}
              onChange={(e) => set('resumeText', e.target.value)}
            />
            <FormInput
              label="Resume URL"
              value={d.resumeUrl || ''}
              onChange={(e) => set('resumeUrl', e.target.value)}
            />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Navigation Visibility</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Toggle sections to show or hide them in the navbar. Edit display labels.
          </p>
          <div className="space-y-3">
            {mergedNavItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
              >
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.visible !== false}
                    onChange={() => toggleVisibility(item.id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateLabel(item.id, e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <span className="text-xs font-mono text-gray-400 dark:text-gray-500 w-20 text-right">
                  #{item.id}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NavbarEditor;