import { Search } from 'lucide-react';

const PageHeader = ({ 
  title, 
  subtitle, 
  searchTerm, 
  setSearchTerm, 
  searchPlaceholder = "Search...",
  actions,
  stats
}) => {
  return (
    <div className="space-y-6 mb-8 font-sans">
      {/* Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
                {subtitle}
              </p>
            )}
          </div>
          {stats}
        </div>
        <div className="flex items-center gap-3">
          {actions}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm text-gray-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
