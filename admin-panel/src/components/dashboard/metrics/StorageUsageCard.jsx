import { Database, Cloud, Image, Film, HardDrive } from 'lucide-react';
import SimpleProgressBar from './SimpleProgressBar';

const StorageUsageCard = ({ data, isLoading }) => {
  if (isLoading || !data) {
    return (
      <div className="rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 bg-gray-700/50 rounded" />
          <div className="space-y-3">
            <div className="h-16 bg-gray-700/50 rounded" />
            <div className="h-16 bg-gray-700/50 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl p-6">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2.5 mb-5">
        <HardDrive className="w-5 h-5 text-blue-400" />
        Storage Breakdown
      </h3>

      <div className="space-y-5">
        {data.cloudinary && (
          <div className="p-4 rounded-xl bg-white/5 dark:bg-white/5 ring-1 ring-white/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <Cloud className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-gray-200">Cloudinary Media</span>
              </div>
              <span className="text-sm font-medium text-white">{data.cloudinary.used} / {data.cloudinary.limit}</span>
            </div>
            <SimpleProgressBar percent={data.cloudinary.percent} color="blue" />
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-700/30">
              <div className="flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-sm text-gray-300">{data.cloudinary.images}</span>
                <span className="text-xs text-gray-500">images</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-sm text-gray-300">{data.cloudinary.videos}</span>
                <span className="text-xs text-gray-500">videos</span>
              </div>
              <span className="text-xs text-gray-500 ml-auto">{data.cloudinary.total} assets</span>
            </div>
          </div>
        )}

        {data.mongodb && (
          <div className="p-4 rounded-xl bg-white/5 dark:bg-white/5 ring-1 ring-white/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-gray-200">MongoDB Database</span>
              </div>
              <span className="text-sm font-medium text-white">{data.mongodb.dataSize}</span>
            </div>
            <SimpleProgressBar
              percent={data.mongodb.storageSize ? parseFloat(((data.mongodb.documents / 10000) * 100).toFixed(1)) : 0}
              color="purple"
            />
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-700/30">
              <span className="text-xs text-gray-500">{data.mongodb.collections} collections</span>
              <span className="text-xs text-gray-500">{data.mongodb.documents.toLocaleString()} documents</span>
              <span className="text-xs text-gray-500 ml-auto">{data.mongodb.storageSize} stored</span>
            </div>
          </div>
        )}

        {data.projectAssets && (
          <div className="p-4 rounded-xl bg-white/5 dark:bg-white/5 ring-1 ring-white/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-gray-200">Project Assets</span>
              </div>
              <span className="text-sm font-medium text-white">{data.projectAssets.totalSize}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{data.projectAssets.totalFiles} files</span>
            </div>
            {data.projectAssets.sections && (
              <div className="mt-3 pt-3 border-t border-gray-700/30 space-y-1.5">
                {data.projectAssets.sections.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-gray-400">{s.name}</span>
                    </div>
                    <span className="text-gray-500">{s.count} files</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StorageUsageCard;
