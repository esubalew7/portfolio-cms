import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useContentSection } from '../../hooks/useContentSection';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';
import FormInput from '../../components/ui/FormInput';
import ImageUploader from '../../components/ui/ImageUploader';
import api from '../../utils/api';

const ALL_SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'contact', label: 'Contact' },
];

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

const Switch = ({ checked, onChange, id }) => (
  <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
  </label>
);

const NavbarEditor = () => {
  const { showToast } = useToast();
  const { data, allContent, loading, saving, error, update, refetch } = useContentSection('navbar');
  const [sections, setSections] = useState({
    hero: true,
    about: true,
    skills: true,
    projects: true,
    experience: true,
    testimonials: false,
    terminal: false,
    contact: true,
  });
  const [savingCustom, setSavingCustom] = useState(false);

  useEffect(() => {
    if (allContent?.sections) {
      setSections((prev) => ({ ...prev, ...allContent.sections }));
    }
  }, [allContent]);

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

  const mergedNavItems = NAV_ITEMS.map((section) => {
    const existing = currentNavItems.find((item) => item.id === section.id);
    return existing || { id: section.id, label: section.label };
  });

  const updateLabel = (id, label) => {
    const updated = mergedNavItems.map((item) =>
      item.id === id ? { ...item, label } : item
    );
    set('navItems', updated);
  };

  const toggleSection = (id) => {
    setSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async () => {
    setSavingCustom(true);
    try {
      await api.put('/api/content', { navbar: d, sections });
      showToast('Navbar saved!');
    } catch (err) {
      showToast('Failed to save: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setSavingCustom(false);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Navbar Editor"
        subtitle="Control branding, section visibility, and navigation labels."
        onSave={handleSave}
        saving={savingCustom}
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
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Section Visibility</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Toggle sections to show or hide them on the frontend. Hidden sections are removed from the navbar, mobile menu, scroll navigation, and page rendering.
          </p>
          <div className="space-y-2">
            {ALL_SECTIONS.map((section) => (
              <div
                key={section.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <Switch
                    id={`section-${section.id}`}
                    checked={sections[section.id] !== false}
                    onChange={() => toggleSection(section.id)}
                  />
                  <label
                    htmlFor={`section-${section.id}`}
                    className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer select-none"
                  >
                    {section.label}
                  </label>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    sections[section.id] !== false
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {sections[section.id] !== false ? 'Visible' : 'Hidden'}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Navigation Labels</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Customize the display labels for navigation links.
          </p>
          <div className="space-y-3">
            {mergedNavItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
              >
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
