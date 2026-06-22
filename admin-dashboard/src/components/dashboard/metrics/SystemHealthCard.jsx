import { Clock, Cpu, HardDrive, Server, Activity } from 'lucide-react';
import SimpleProgressBar from './SimpleProgressBar';

const statusConfig = {
  healthy: {
    label: 'Healthy',
    dot: 'bg-emerald-400',
    bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  },
  warning: {
    label: 'Warning',
    dot: 'bg-amber-400',
    bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  },
  critical: {
    label: 'Critical',
    dot: 'bg-red-400',
    bg: 'bg-red-500/10 text-red-300 border-red-500/30',
  },
};

const SystemHealthCard = ({ data, isLoading }) => {
  if (isLoading || !data) {
    return (
      <div className="rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 bg-gray-700/50 rounded" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-700/50 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const status = statusConfig[data.status] || statusConfig.healthy;

  return (
    <div className="rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">System Health</h3>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${status.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="p-4 rounded-xl bg-white/5 dark:bg-white/5 ring-1 ring-white/5">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
            <Cpu className="w-3.5 h-3.5" />
            CPU Usage
          </div>
          <p className="text-xl font-bold text-white">{data.cpu.percent}%</p>
          <p className="text-xs text-gray-500 mt-0.5">{data.cpu.cores} cores</p>
        </div>
        <div className="p-4 rounded-xl bg-white/5 dark:bg-white/5 ring-1 ring-white/5">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
            <HardDrive className="w-3.5 h-3.5" />
            Memory Usage
          </div>
          <p className="text-xl font-bold text-white">{data.memory.percent}%</p>
          <p className="text-xs text-gray-500 mt-0.5">{data.memory.used} / {data.memory.total}</p>
        </div>
        <div className="p-4 rounded-xl bg-white/5 dark:bg-white/5 ring-1 ring-white/5">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
            <Clock className="w-3.5 h-3.5" />
            Server Uptime
          </div>
          <p className="text-xl font-bold text-white">{data.uptime.formatted}</p>
          <p className="text-xs text-gray-500 mt-0.5">Since last restart</p>
        </div>
        <div className="p-4 rounded-xl bg-white/5 dark:bg-white/5 ring-1 ring-white/5">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
            <Server className="w-3.5 h-3.5" />
            Environment
          </div>
          <p className="text-xl font-bold text-white capitalize">{data.environment}</p>
          <p className="text-xs text-gray-500 mt-0.5">Node {data.nodeVersion}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span>Memory Usage</span>
            <span>{data.memory.percent}%</span>
          </div>
          <SimpleProgressBar percent={data.memory.percent} color="blue" showLabel={false} />
        </div>
      </div>
    </div>
  );
};

export default SystemHealthCard;
