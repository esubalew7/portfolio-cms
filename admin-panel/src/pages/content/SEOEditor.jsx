import { useContentSection } from '../../hooks/useContentSection';
import { RefreshCw } from 'lucide-react';
import SectionHeader from '../../components/ui/SectionHeader';
import Card from '../../components/ui/Card';
import FormInput from '../../components/ui/FormInput';

const SEOEditor = () => {
  const { data, allContent, loading, saving, error, update, save, refetch } = useContentSection('seo');

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
        <p className="font-bold">Failed to load SEO settings.</p>
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

  const d = data || { title: '', description: '', ogImage: '', keywords: '' };

  const setField = (field, value) => {
    update({ ...d, [field]: value });
  };

  const heroName = allContent?.hero?.name || 'Esubalew';

  return (
    <div>
      <SectionHeader
        title="SEO Editor"
        subtitle="Manage meta tags, Open Graph, and search engine previews."
        onSave={save}
        saving={saving}
      />

      <div className="space-y-4">
        <Card>
          <div className="flex items-center gap-3 p-3 mb-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Meta Title auto-populates from Hero name. Leave empty to use <strong>{heroName} - Portfolio</strong>.
            </p>
          </div>
          <div className="space-y-4">
            <FormInput
              label="Meta Title"
              value={d.title}
              onChange={(e) => setField('title', e.target.value)}
            />
            <FormInput
              label="Meta Description"
              textarea
              rows={3}
              value={d.description}
              onChange={(e) => setField('description', e.target.value)}
            />
            <FormInput
              label="OG Image URL"
              value={d.ogImage}
              onChange={(e) => setField('ogImage', e.target.value)}
            />
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Keywords</label>
              <input
                className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="portfolio, developer, react"
                value={d.keywords}
                onChange={(e) => setField('keywords', e.target.value)}
              />
              <p className="text-xs text-gray-400">Comma-separated keywords</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SEOEditor;
