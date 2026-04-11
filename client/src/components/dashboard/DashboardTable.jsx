import { Loader2, Eye } from 'lucide-react';

const DashboardTable = ({ 
  columns, 
  data, 
  loading, 
  emptyMessage = "No items found.",
  searchTerm = ""
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden font-sans">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            <tr>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${col.className || ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span>Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-20 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full">
                        <Eye className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                    </div>
                    <div className="max-w-xs mx-auto">
                      <p className="font-semibold text-gray-900 dark:text-white mb-1">
                        {searchTerm ? 'No results found' : 'Everything looks empty'}
                      </p>
                      <p className="text-sm">
                        {searchTerm 
                          ? `We couldn't find anything matching "${searchTerm}"` 
                          : emptyMessage}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, rowIdx) => (
                <tr 
                  key={item._id || item.id || rowIdx} 
                  className="group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`px-6 py-4 ${col.className || ''}`}>
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardTable;
