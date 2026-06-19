import { useContentSection } from '../../hooks/useContentSection';
import { RefreshCw, Plus, Trash2 } from 'lucide-react';
import SectionHeader from '../../components/ui/SectionHeader';
import Card from '../../components/ui/Card';
import FormInput from '../../components/ui/FormInput';

const emptyItem = {
  role: '', company: '', duration: '', location: '',
  tags: [], bullets: [], logo: ''
};

const ExperienceEditor = () => {
  const { data, loading, saving, error, update, save, refetch } = useContentSection('experience');

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
        <p className="font-bold">Failed to load experience section.</p>
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

  const d = data || { title: '', subtitle: '', categories: [] };

  const setField = (field, value) => {
    update({ ...d, [field]: value });
  };

  const addCategory = () => {
    setField('categories', [...d.categories, { name: '', items: [] }]);
  };

  const removeCategory = (ci) => {
    setField('categories', d.categories.filter((_, i) => i !== ci));
  };

  const setCategoryField = (ci, field, value) => {
    const updated = d.categories.map((c, i) => (i === ci ? { ...c, [field]: value } : c));
    setField('categories', updated);
  };

  const addItem = (ci) => {
    const updated = d.categories.map((c, i) =>
      i === ci ? { ...c, items: [...c.items, { ...emptyItem }] } : c
    );
    setField('categories', updated);
  };

  const removeItem = (ci, ii) => {
    const updated = d.categories.map((c, i) =>
      i === ci ? { ...c, items: c.items.filter((_, j) => j !== ii) } : c
    );
    setField('categories', updated);
  };

  const setItemField = (ci, ii, field, value) => {
    const updated = d.categories.map((c, i) =>
      i === ci
        ? {
            ...c,
            items: c.items.map((item, j) =>
              j === ii ? { ...item, [field]: value } : item
            ),
          }
        : c
    );
    setField('categories', updated);
  };

  return (
    <div>
      <SectionHeader
        title="Experience Editor"
        subtitle="Manage your work experience, education, and timeline entries."
        onSave={save}
        saving={saving}
      />

      <div className="space-y-4">
        <Card>
          <div className="space-y-4">
            <FormInput
              label="Section Title"
              value={d.title}
              onChange={(e) => setField('title', e.target.value)}
            />
            <FormInput
              label="Section Subtitle"
              textarea
              rows={2}
              value={d.subtitle}
              onChange={(e) => setField('subtitle', e.target.value)}
            />
          </div>
        </Card>

        {d.categories.map((cat, ci) => (
          <Card key={ci} padding={false}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {cat.name || `Category ${ci + 1}`}
              </h3>
              <button
                type="button"
                onClick={() => removeCategory(ci)}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <FormInput
                label="Category Name"
                value={cat.name}
                onChange={(e) => setCategoryField(ci, 'name', e.target.value)}
              />

              {cat.items.map((item, ii) => (
                <div
                  key={ii}
                  className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {item.role || `Item ${ii + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(ci, ii)}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormInput
                      label="Role / Title"
                      value={item.role}
                      onChange={(e) => setItemField(ci, ii, 'role', e.target.value)}
                    />
                    <FormInput
                      label="Company"
                      value={item.company}
                      onChange={(e) => setItemField(ci, ii, 'company', e.target.value)}
                    />
                    <FormInput
                      label="Duration"
                      value={item.duration}
                      onChange={(e) => setItemField(ci, ii, 'duration', e.target.value)}
                    />
                    <FormInput
                      label="Location"
                      value={item.location}
                      onChange={(e) => setItemField(ci, ii, 'location', e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Tags</label>
                    <input
                      className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="React, Node.js, MongoDB"
                      value={item.tags.join(', ')}
                      onChange={(e) =>
                        setItemField(
                          ci,
                          ii,
                          'tags',
                          e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                        )
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Bullet Points</label>
                    <input
                      className="w-full px-4 py-2.5 border rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="Achieved X, Built Y, Led Z"
                      value={item.bullets.join(', ')}
                      onChange={(e) =>
                        setItemField(
                          ci,
                          ii,
                          'bullets',
                          e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                        )
                      }
                    />
                  </div>

                  <FormInput
                    label="Logo URL"
                    value={item.logo}
                    onChange={(e) => setItemField(ci, ii, 'logo', e.target.value)}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => addItem(ci)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>
          </Card>
        ))}

        <button
          type="button"
          onClick={addCategory}
          className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-600 dark:hover:text-blue-400 transition-all w-full justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>
    </div>
  );
};

export default ExperienceEditor;
