import { Save, Loader2 } from 'lucide-react';

const SectionHeader = ({ title, subtitle, onSave, saving = false }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
    </div>
    {onSave && (
      <button
        onClick={onSave}
        disabled={saving}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    )}
  </div>
);

export default SectionHeader;
