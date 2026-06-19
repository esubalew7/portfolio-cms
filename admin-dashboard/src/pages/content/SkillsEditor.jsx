import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { useContentSection } from '../../hooks/useContentSection';
import Card from '../../components/ui/Card';
import SectionHeader from '../../components/ui/SectionHeader';
import FormInput from '../../components/ui/FormInput';

const SkillsEditor = () => {
  const { data, loading, saving, error, update, save, refetch } = useContentSection('skills');

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
        <p className="font-bold mb-2">Failed to load skills section</p>
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

  const skills = data || {};

  const handleAddCategory = () => {
    const categories = [...(skills.categories || []), { name: '', items: [] }];
    update({ ...skills, categories });
  };

  const handleRemoveCategory = (index) => {
    const categories = skills.categories.filter((_, i) => i !== index);
    update({ ...skills, categories });
  };

  const handleCategoryNameChange = (index, value) => {
    const categories = skills.categories.map((c, i) =>
      i === index ? { ...c, name: value } : c
    );
    update({ ...skills, categories });
  };

  const handleAddSkill = (catIndex) => {
    const categories = skills.categories.map((c, i) =>
      i === catIndex
        ? { ...c, items: [...(c.items || []), { name: '', level: 0 }] }
        : c
    );
    update({ ...skills, categories });
  };

  const handleRemoveSkill = (catIndex, skillIndex) => {
    const categories = skills.categories.map((c, i) =>
      i === catIndex
        ? { ...c, items: c.items.filter((_, si) => si !== skillIndex) }
        : c
    );
    update({ ...skills, categories });
  };

  const handleSkillChange = (catIndex, skillIndex, field, value) => {
    const categories = skills.categories.map((c, i) =>
      i === catIndex
        ? {
            ...c,
            items: c.items.map((s, si) =>
              si === skillIndex ? { ...s, [field]: value } : s
            ),
          }
        : c
    );
    update({ ...skills, categories });
  };

  return (
    <div className="max-w-4xl">
      <SectionHeader
        title="Skills Section"
        subtitle="Edit your skills and proficiency categories"
        onSave={save}
        saving={saving}
      />

      <Card className="space-y-6">
        <FormInput
          label="Title"
          value={skills.title || ''}
          onChange={(e) => update({ ...skills, title: e.target.value })}
        />
        <FormInput
          label="Subtitle"
          value={skills.subtitle || ''}
          onChange={(e) => update({ ...skills, subtitle: e.target.value })}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Categories
            </label>
            <button
              type="button"
              onClick={handleAddCategory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Category
            </button>
          </div>
          {(skills.categories || []).length === 0 && (
            <p className="text-sm text-gray-400 italic text-center py-4">
              No categories yet. Click "Add Category" to create one.
            </p>
          )}
          {(skills.categories || []).map((category, catIndex) => (
            <div
              key={catIndex}
              className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {category.name || `Category ${catIndex + 1}`}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(catIndex)}
                  className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <FormInput
                label="Category Name"
                value={category.name || ''}
                onChange={(e) => handleCategoryNameChange(catIndex, e.target.value)}
              />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Skills
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddSkill(catIndex)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Skill
                  </button>
                </div>
                {(category.items || []).length === 0 && (
                  <p className="text-sm text-gray-400 italic text-center py-2">
                    No skills yet.
                  </p>
                )}
                {(category.items || []).map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <FormInput
                        label="Name"
                        value={skill.name || ''}
                        onChange={(e) =>
                          handleSkillChange(catIndex, skillIndex, 'name', e.target.value)
                        }
                      />
                      <FormInput
                        label="Level (0-100)"
                        type="number"
                        min={0}
                        max={100}
                        value={skill.level ?? 0}
                        onChange={(e) =>
                          handleSkillChange(
                            catIndex,
                            skillIndex,
                            'level',
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(catIndex, skillIndex)}
                      className="mt-7 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SkillsEditor;
