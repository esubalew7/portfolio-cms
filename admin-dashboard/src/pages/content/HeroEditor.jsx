import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { useContentSection } from '../../hooks/useContentSection';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';
import FormInput from '../../components/ui/FormInput';
import ImageUploader from '../../components/ui/ImageUploader';

const HeroEditor = () => {
  const { data, loading, saving, error, update, save, refetch } = useContentSection('hero');

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
        <p className="font-bold mb-2">Failed to load hero section</p>
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

  const hero = data || {};

  const handleAddTitle = () => {
    const titles = [...(hero.titles || []), ''];
    update({ ...hero, titles });
  };

  const handleRemoveTitle = (index) => {
    const titles = hero.titles.filter((_, i) => i !== index);
    update({ ...hero, titles });
  };

  const handleTitleChange = (index, value) => {
    const titles = hero.titles.map((t, i) => (i === index ? value : t));
    update({ ...hero, titles });
  };

  const handleCtaChange = (key, field, value) => {
    const cta = {
      primary: { text: '', link: '' },
      secondary: { text: '', link: '' },
      ...hero.cta,
      [key]: { ...(hero.cta?.[key] || {}), [field]: value },
    };
    update({ ...hero, cta });
  };

  return (
    <div className="max-w-4xl">
      <SectionHeader
        title="Hero Section"
        subtitle="Edit your hero/landing section content"
        onSave={save}
        saving={saving}
      />

      <Card className="space-y-6">
        <FormInput
          label="Greeting"
          value={hero.greeting || ''}
          onChange={(e) => update({ ...hero, greeting: e.target.value })}
        />
        <FormInput
          label="Name"
          value={hero.name || ''}
          onChange={(e) => update({ ...hero, name: e.target.value })}
        />
        <ImageUploader
          label="Profile Image"
          value={hero.image || ''}
          onChange={(url) => update({ ...hero, image: url })}
        />
       {/* <ImageUploader
          label="Background Image"
          value={hero.backgroundImage || ''}
          onChange={(url) => update({ ...hero, backgroundImage: url })}
        /> */}
        <FormInput
          label="Description"
          textarea
          rows={3}
          value={hero.description || ''}
          onChange={(e) => update({ ...hero, description: e.target.value })}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Typewriter Titles
            </label>
            <button
              type="button"
              onClick={handleAddTitle}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Title
            </button>
          </div>
          {(hero.titles || []).length === 0 && (
            <p className="text-sm text-gray-400 italic text-center py-4">
              No titles yet. Click "Add Title" to create one.
            </p>
          )}
          {(hero.titles || []).map((title, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-1">
                <FormInput
                  label={`Title ${index + 1}`}
                  value={title}
                  onChange={(e) => handleTitleChange(index, e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveTitle(index)}
                className="mt-7 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Primary CTA
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Text"
              value={hero.cta?.primary?.text || ''}
              onChange={(e) => handleCtaChange('primary', 'text', e.target.value)}
            />
            <FormInput
              label="Link"
              value={hero.cta?.primary?.link || ''}
              onChange={(e) => handleCtaChange('primary', 'link', e.target.value)}
            />
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Secondary CTA
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Text"
              value={hero.cta?.secondary?.text || ''}
              onChange={(e) => handleCtaChange('secondary', 'text', e.target.value)}
            />
            <FormInput
              label="Link"
              value={hero.cta?.secondary?.link || ''}
              onChange={(e) => handleCtaChange('secondary', 'link', e.target.value)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HeroEditor;
