import { useContentSection } from '../../hooks/useContentSection';
import { RefreshCw } from 'lucide-react';
import SectionHeader from '../../components/ui/SectionHeader';
import Card from '../../components/ui/Card';
import FormInput from '../../components/ui/FormInput';

const TerminalEditor = () => {
  const { data, loading, saving, error, update, save, refetch } = useContentSection('terminal');

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
        <p className="font-bold">Failed to load terminal section.</p>
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

  const d = data || { title: '', subtitle: '', content: '' };

  const setField = (field, value) => {
    update({ ...d, [field]: value });
  };

  return (
    <div>
      <SectionHeader
        title="Terminal Editor"
        subtitle="Manage the interactive terminal commands and responses."
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
            <FormInput
              label="Terminal Content"
              textarea
              rows={10}
              value={d.content}
              onChange={(e) => setField('content', e.target.value)}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TerminalEditor;
