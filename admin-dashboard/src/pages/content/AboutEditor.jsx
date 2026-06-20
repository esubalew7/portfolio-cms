import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { useContentSection } from '../../hooks/useContentSection';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';
import FormInput from '../../components/ui/FormInput';
import ImageUploader from '../../components/ui/ImageUploader';

const AboutEditor = () => {
  const { data, loading, saving, error, update, save, refetch } = useContentSection('about');

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
        <p className="font-bold mb-2">Failed to load about section</p>
        <p className="text-sm mb-4">{error}</p>
        <button
          onClick={refetch}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  const about = data || {};

  const handleAddStat = () => {
    const stats = [...(about.stats || []), { label: '', value: '', suffix: '' }];
    update({ ...about, stats });
  };

  const handleRemoveStat = (index) => {
    const stats = about.stats.filter((_, i) => i !== index);
    update({ ...about, stats });
  };

  const handleStatChange = (index, field, value) => {
    const stats = about.stats.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    update({ ...about, stats });
  };

  return (
    <div className="max-w-4xl">
      <SectionHeader
        title="About Section"
        subtitle="Edit your about/bio section content"
        onSave={save}
        saving={saving}
      />

      <Card className="space-y-6">
        <FormInput
          label="Title"
          value={about.title || ''}
          onChange={(e) => update({ ...about, title: e.target.value })}
        />
        <FormInput
          label="Subtitle"
          value={about.subtitle || ''}
          onChange={(e) => update({ ...about, subtitle: e.target.value })}
        />
        <FormInput
          label="Description"
          textarea
          rows={3}
          value={about.description || ''}
          onChange={(e) => update({ ...about, description: e.target.value })}
        />
        <ImageUploader
          label="Profile Image"
          value={about.image || ''}
          onChange={(url) => update({ ...about, image: url })}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Stats
            </label>
            <button
              type="button"
              onClick={handleAddStat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Stat
            </button>
          </div>
          {(about.stats || []).length === 0 && (
            <p className="text-sm text-gray-400 italic text-center py-4">
              No stats yet. Click "Add Stat" to create one.
            </p>
          )}
          {(about.stats || []).map((stat, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 space-y-3 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Stat {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveStat(index)}
                  className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormInput
                  label="Label"
                  value={stat.label || ''}
                  onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                />
                <FormInput
                  label="Value"
                  value={stat.value || ''}
                  onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                />
                <FormInput
                  label="Suffix"
                  value={stat.suffix || ''}
                  onChange={(e) => handleStatChange(index, 'suffix', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Call to Action
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="CTA Text"
              value={about.cta?.text || ''}
              onChange={(e) =>
                update({ ...about, cta: { ...about.cta, text: e.target.value } })
              }
            />
            <FormInput
              label="CTA Link"
              value={about.cta?.link || ''}
              onChange={(e) =>
                update({ ...about, cta: { ...about.cta, link: e.target.value } })
              }
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AboutEditor;
