import { useState, useEffect, useCallback } from 'react';
import { HardDrive, FolderOpen, Image, Heart, RefreshCw, Server } from 'lucide-react';
import api from '../../utils/api';
import MetricOverviewCard from '../../components/dashboard/metrics/MetricOverviewCard';
import StorageUsageCard from '../../components/dashboard/metrics/StorageUsageCard';
import SystemHealthCard from '../../components/dashboard/metrics/SystemHealthCard';

const REFRESH_INTERVAL = 30000;

const PortfolioMetrics = () => {
  const [overview, setOverview] = useState(null);
  const [storage, setStorage] = useState(null);
  const [system, setSystem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAllMetrics = useCallback(async () => {
    try {
      const [overviewRes, storageRes, systemRes] = await Promise.all([
        api.get('/api/metrics/overview'),
        api.get('/api/metrics/storage'),
        api.get('/api/metrics/system'),
      ]);
      setOverview(overviewRes.data);
      setStorage(storageRes.data);
      setSystem(systemRes.data);
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

  const serverStatusColor = overview?.serverStatus === 'healthy' ? 'green'
    : overview?.serverStatus === 'warning' ? 'amber' : 'red';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Server className="w-6 h-6 text-emerald-400" />
            Portfolio System Overview
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time summary of your portfolio infrastructure
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
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          Unable to load real data: {error}
        </div>
      )}

      {/* SECTION 1: System Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricOverviewCard
          title="Total Storage Used"
          value={overview?.totalStorage || '—'}
          icon={HardDrive}
          status="green"
          description={overview ? `Cloudinary + MongoDB combined` : undefined}
          isLoading={loading && !overview}
        />
        <MetricOverviewCard
          title="Total Projects"
          value={overview?.totalProjects ?? '—'}
          icon={FolderOpen}
          status="blue"
          description={overview ? `Portfolio projects count` : undefined}
          isLoading={loading && !overview}
        />
        <MetricOverviewCard
          title="Media Files Uploaded"
          value={overview?.totalMediaFiles ?? '—'}
          icon={Image}
          status="blue"
          description={overview ? `Images and videos on Cloudinary` : undefined}
          isLoading={loading && !overview}
        />
        <MetricOverviewCard
          title="Server Status"
          value={overview?.serverStatus === 'healthy' ? 'Healthy'
            : overview?.serverStatus === 'warning' ? 'Warning'
            : overview?.serverStatus === 'critical' ? 'Critical' : '—'}
          icon={Heart}
          status={serverStatusColor}
          description={overview?.serverStatus === 'healthy' ? 'All systems operational'
            : overview?.serverStatus === 'warning' ? 'Performance degraded'
            : overview?.serverStatus === 'critical' ? 'Critical issues detected'
            : undefined}
          isLoading={loading && !overview}
        />
      </div>

      {/* SECTION 2: Storage Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StorageUsageCard data={storage} isLoading={loading && !storage} />
        <SystemHealthCard data={system} isLoading={loading && !system} />
      </div>
    </div>
  );
};

export default PortfolioMetrics;
