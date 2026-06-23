import { RefreshCw } from 'lucide-react';
import { useContentSection } from '../../hooks/useContentSection';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';
import FormInput from '../../components/ui/FormInput';

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

  const d = data || {};

  const set = (field, value) => {
    update({ ...d, [field]: value });
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

        <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Social Links Moved</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Social links are now managed centrally from the{' '}
                <a href="/dashboard/content/social-links" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  Social Links Editor
                </a>
                . Any changes there will automatically reflect in the Hero and Footer sections. This editor is kept for backward compatibility.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FooterEditor;