import { useState, useEffect, useCallback } from 'react';
import {
  Cloud, Database, Activity, HardDrive, Heart, RefreshCw,
  BarChart3, Image, Film, FolderOpen
} from 'lucide-react';
import api from '../../utils/api';
import MetricCard from '../../components/dashboard/metrics/MetricCard';
import UsageProgressBar from '../../components/dashboard/metrics/UsageProgressBar';
import StoragePieChart from '../../components/dashboard/metrics/StoragePieChart';
import PerformanceLineChart from '../../components/dashboard/metrics/PerformanceLineChart';
import SystemHealthPanel from '../../components/dashboard/metrics/SystemHealthPanel';

const REFRESH_INTERVAL = 30000;

const PortfolioMetrics = () => {
  const [cloudinary, setCloudinary] = useState(null);
  const [mongodb, setMongodb] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [storage, setStorage] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAllMetrics = useCallback(async () => {
    try {
      const [cloudRes, mongoRes, perfRes, storageRes, healthRes] = await Promise.all([
        api.get('/api/metrics/cloudinary'),
        api.get('/api/metrics/mongodb'),
        api.get('/api/metrics/api-performance'),
        api.get('/api/metrics/storage-breakdown'),
        api.get('/api/metrics/health'),
      ]);
      setCloudinary(cloudRes.data);
      setMongodb(mongoRes.data);
      setPerformance(perfRes.data);
      setStorage(storageRes.data);
      setHealth(healthRes.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('[Metrics] Fetch error:', err);
      setError(err.message || 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllMetrics();
    const interval = setInterval(fetchAllMetrics, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAllMetrics]);

  const pieData = storage?.sections?.map(s => ({
    label: s.name,
    value: s.bytes,
    color: s.color,
  })) || [];

  const perfChartData = performance?.timeSeries?.map(d => ({
    label: d.label,
    value: d.duration,
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Portfolio Performance Monitor
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time system observability and resource monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchAllMetrics}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Cloudinary Storage"
          value={cloudinary?.storage?.usedFormatted || '—'}
          icon={Cloud}
          color="blue"
          subtitle={cloudinary ? `${cloudinary.assets.total} assets` : undefined}
          isLoading={loading && !cloudinary}
        />
        <MetricCard
          title="Database Size"
          value={mongodb?.databaseSizeFormatted || '—'}
          icon={Database}
          color="purple"
          subtitle={mongodb ? `${mongodb.collections} collections` : undefined}
          isLoading={loading && !mongodb}
        />
        <MetricCard
          title="API Response Time"
          value={performance ? `${performance.recentAvgDuration}ms` : '—'}
          icon={Activity}
          color="green"
          subtitle={performance ? `${performance.rpm} req/min` : undefined}
          isLoading={loading && !performance}
        />
        <MetricCard
          title="Total Assets Size"
          value={storage?.totalFormatted || '—'}
          icon={HardDrive}
          color="orange"
          subtitle={storage ? `${storage.totalAssets} files` : undefined}
          isLoading={loading && !storage}
        />
        <MetricCard
          title="System Health"
          value={health?.status === 'healthy' ? 'Healthy' : health?.status === 'warning' ? 'Warning' : health?.status === 'critical' ? 'Critical' : '—'}
          icon={Heart}
          color={health?.status === 'healthy' ? 'green' : health?.status === 'warning' ? 'orange' : 'red'}
          subtitle={health?.uptimeFormatted || undefined}
          isLoading={loading && !health}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl p-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Cloud className="w-5 h-5 text-blue-400" />
            Cloudinary Storage
          </h3>
          {cloudinary ? (
            <div className="space-y-4">
              <UsageProgressBar
                label="Storage Usage"
                used={cloudinary.storage.usedFormatted}
                total={cloudinary.storage.limitFormatted}
                unit=""
                color="blue"
              />
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700/50">
                <div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                    <Image className="w-3.5 h-3.5" />
                    Images
                  </div>
                  <p className="text-lg font-semibold text-white">{cloudinary.assets.images}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                    <Film className="w-3.5 h-3.5" />
                    Videos
                  </div>
                  <p className="text-lg font-semibold text-white">{cloudinary.assets.videos}</p>
                </div>
              </div>
              {Object.keys(cloudinary.folders).length > 0 && (
                <div className="pt-4 border-t border-gray-700/50">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                    <FolderOpen className="w-3.5 h-3.5" />
                    Folder Breakdown
                  </div>
                  <div className="space-y-2">
                    {Object.entries(cloudinary.folders).map(([folder, fdata]) => (
                      <div key={folder} className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">{folder === 'root' ? 'Root' : folder}</span>
                        <span className="text-gray-400">{fdata.count} assets</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-pulse space-y-3">
              <div className="h-10 bg-gray-700/50 rounded" />
              <div className="h-8 bg-gray-700/50 rounded w-1/2" />
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl p-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <HardDrive className="w-5 h-5 text-purple-400" />
            Storage Distribution
          </h3>
          {storage ? (
            <StoragePieChart data={pieData} size={220} />
          ) : (
            <div className="animate-pulse flex items-center justify-center h-[260px]">
              <div className="w-48 h-48 bg-gray-700/50 rounded-full" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl p-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-emerald-400" />
            API Performance (Last 20 Requests)
          </h3>
          {performance ? (
            <div className="space-y-4">
              <PerformanceLineChart data={perfChartData} color="#10B981" height={120} />
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700/50">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Average (all time)</p>
                  <p className="text-lg font-semibold text-white">{performance.avgDuration}ms</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Recent (5 min)</p>
                  <p className="text-lg font-semibold text-white">{performance.recentAvgDuration}ms</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Requests/min</p>
                  <p className="text-lg font-semibold text-white">{performance.rpm}</p>
                </div>
              </div>
              {performance.slowest?.length > 0 && (
                <div className="pt-4 border-t border-gray-700/50">
                  <p className="text-xs text-gray-400 mb-2">Slowest Endpoints</p>
                  <div className="space-y-1">
                    {performance.slowest.slice(0, 3).map((ep) => (
                      <div key={ep.route} className="flex items-center justify-between text-xs">
                        <span className="text-gray-300 font-mono">{ep.route}</span>
                        <span className="text-red-400">{ep.avgDuration}ms avg</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-pulse space-y-3">
              <div className="h-[120px] bg-gray-700/50 rounded" />
              <div className="h-12 bg-gray-700/50 rounded" />
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl p-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-purple-400" />
            MongoDB Database
          </h3>
          {mongodb ? (
            <div className="space-y-4">
              <UsageProgressBar
                label="Data Size"
                used={mongodb.databaseSizeFormatted}
                total={mongodb.storageSizeFormatted}
                unit=""
                color="purple"
              />
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700/50">
                <div>
                  <p className="text-xs text-gray-400">Collections</p>
                  <p className="text-lg font-semibold text-white">{mongodb.collections}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total Documents</p>
                  <p className="text-lg font-semibold text-white">{mongodb.totalDocuments.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Index Size</p>
                  <p className="text-lg font-semibold text-white">{mongodb.indexSizeFormatted}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Avg Object Size</p>
                  <p className="text-lg font-semibold text-white">{Math.round(mongodb.avgObjectSize)} bytes</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-pulse space-y-3">
              <div className="h-10 bg-gray-700/50 rounded" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 bg-gray-700/50 rounded" />
                <div className="h-12 bg-gray-700/50 rounded" />
              </div>
            </div>
          )}
        </div>
      </div>

      <SystemHealthPanel data={health} isLoading={loading && !health} />
    </div>
  );
};

export default PortfolioMetrics;
