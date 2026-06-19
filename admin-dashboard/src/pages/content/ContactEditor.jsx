import { useContentSection } from '../../hooks/useContentSection';
import { RefreshCw } from 'lucide-react';
import SectionHeader from '../../components/ui/SectionHeader';
import Card from '../../components/ui/Card';
import FormInput from '../../components/ui/FormInput';

const ContactEditor = () => {
  const { data, loading, saving, error, update, save, refetch } = useContentSection('contactInfo');

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
        <p className="font-bold">Failed to load contact info.</p>
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

  const d = data || {
    email: '', phone: '', location: '',
    formTitle: '', formDescription: '', formButtonText: '', successMessage: ''
  };

  const setField = (field, value) => {
    update({ ...d, [field]: value });
  };

  return (
    <div>
      <SectionHeader
        title="Contact Editor"
        subtitle="Manage your contact information and form settings."
        onSave={save}
        saving={saving}
      />

      <div className="space-y-4">
        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Contact Details</h3>
            <FormInput
              label="Email"
              type="email"
              value={d.email}
              onChange={(e) => setField('email', e.target.value)}
            />
            <FormInput
              label="Phone"
              value={d.phone}
              onChange={(e) => setField('phone', e.target.value)}
            />
            <FormInput
              label="Location"
              value={d.location}
              onChange={(e) => setField('location', e.target.value)}
            />
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Form Settings</h3>
            <FormInput
              label="Form Title"
              value={d.formTitle}
              onChange={(e) => setField('formTitle', e.target.value)}
            />
            <FormInput
              label="Form Description"
              textarea
              rows={3}
              value={d.formDescription}
              onChange={(e) => setField('formDescription', e.target.value)}
            />
            <FormInput
              label="Form Button Text"
              value={d.formButtonText}
              onChange={(e) => setField('formButtonText', e.target.value)}
            />
            <FormInput
              label="Success Message"
              textarea
              rows={3}
              value={d.successMessage}
              onChange={(e) => setField('successMessage', e.target.value)}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContactEditor;
