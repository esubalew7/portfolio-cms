import { Activity, Cpu, HardDrive, Clock, Server } from 'lucide-react';

const SystemHealthPanel = ({ data, isLoading }) => {
  if (isLoading || !data) {
    return (
      <div className="rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 bg-gray-700/50 rounded" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700/50 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statusColors = {
    healthy: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    warning: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    critical: 'text-red-400 border-red-500/30 bg-red-500/10',
  };

  const statusLabel = {
    healthy: 'All Systems Operational',
    warning: 'Performance Degraded',
    critical: 'Critical Issues Detected',
  };

  return (
    <div className="rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-gray-400" />
          System Health
        </h3>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm ${statusColors[data.status] || statusColors.healthy}`}>
          <div className={`w-2 h-2 rounded-full ${data.status === 'healthy' ? 'bg-emerald-400 animate-pulse' : data.status === 'critical' ? 'bg-red-400 animate-pulse' : 'bg-amber-400'}`} />
          {statusLabel[data.status] || 'Unknown'}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Clock className="w-3.5 h-3.5" />
            Uptime
          </div>
          <p className="text-lg font-semibold text-white">{data.uptimeFormatted}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Cpu className="w-3.5 h-3.5" />
            CPU Cores
          </div>
          <p className="text-lg font-semibold text-white">{data.cpu.count}</p>
          <p className="text-xs text-gray-500 truncate" title={data.cpu.model}>{data.cpu.model}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <HardDrive className="w-3.5 h-3.5" />
            Memory
          </div>
          <p className="text-lg font-semibold text-white">{data.systemMemory.usedFormatted}</p>
          <p className="text-xs text-gray-500">of {data.systemMemory.totalFormatted}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Server className="w-3.5 h-3.5" />
            Node.js
          </div>
          <p className="text-lg font-semibold text-white">{data.nodeVersion}</p>
          <p className="text-xs text-gray-500">{data.environment}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>System Memory Usage</span>
          <span>{data.systemMemory.percent}%</span>
        </div>
        <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              parseFloat(data.systemMemory.percent) > 90 ? 'bg-red-500' :
              parseFloat(data.systemMemory.percent) > 75 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${data.systemMemory.percent}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-700/50">
        <div className="text-center">
          <p className="text-xs text-gray-500">Heap Used</p>
          <p className="text-sm font-medium text-white">{data.memory.heapUsedFormatted}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Heap Total</p>
          <p className="text-sm font-medium text-white">{data.memory.heapTotalFormatted}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">RSS</p>
          <p className="text-sm font-medium text-white">{data.memory.rssFormatted}</p>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthPanel;
