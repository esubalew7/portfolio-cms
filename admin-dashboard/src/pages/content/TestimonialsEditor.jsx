import { useContentSection } from '../../hooks/useContentSection';
import { RefreshCw, Plus, Trash2 } from 'lucide-react';
import SectionHeader from '../../components/ui/SectionHeader';
import Card from '../../components/ui/Card';
import FormInput from '../../components/ui/FormInput';

const TestimonialsEditor = () => {
  const { data, loading, saving, error, update, save, refetch } = useContentSection('testimonials');

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
        <p className="font-bold">Failed to load testimonials section.</p>
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

  const d = data || { title: '', subtitle: '', items: [] };

  const setField = (field, value) => {
    update({ ...d, [field]: value });
  };

  const setItemField = (index, field, value) => {
    const updated = d.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setField('items', updated);
  };

  const addItem = () => {
    setField('items', [...d.items, { name: '', role: '', company: '', image: '', rating: 5, feedback: '' }]);
  };

  const removeItem = (index) => {
    setField('items', d.items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <SectionHeader
        title="Testimonials Editor"
        subtitle="Manage client feedback, ratings, and testimonials."
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

        {d.items.map((item, i) => (
          <Card key={i}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  {item.name || `Testimonial ${i + 1}`}
                </h3>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormInput
                  label="Name"
                  value={item.name}
                  onChange={(e) => setItemField(i, 'name', e.target.value)}
                />
                <FormInput
                  label="Role"
                  value={item.role}
                  onChange={(e) => setItemField(i, 'role', e.target.value)}
                />
                <FormInput
                  label="Company"
                  value={item.company}
                  onChange={(e) => setItemField(i, 'company', e.target.value)}
                />
                <FormInput
                  label="Image URL"
                  value={item.image}
                  onChange={(e) => setItemField(i, 'image', e.target.value)}
                />
              </div>

              <FormInput
                label="Rating (1-5)"
                type="number"
                min={1}
                max={5}
                value={item.rating ?? 5}
                onChange={(e) => setItemField(i, 'rating', Number(e.target.value))}
              />

              <FormInput
                label="Feedback"
                textarea
                rows={3}
                value={item.feedback}
                onChange={(e) => setItemField(i, 'feedback', e.target.value)}
              />
            </div>
          </Card>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-600 dark:hover:text-blue-400 transition-all w-full justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>
    </div>
  );
};

export default TestimonialsEditor;
