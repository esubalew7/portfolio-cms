import mongoose from 'mongoose';
import os from 'os';
import cloudinary from '../config/cloudinary.js';
import Project from '../models/Project.js';
import PortfolioContent from '../models/PortfolioContent.js';
import Contact from '../models/Contact.js';
import Notification from '../models/Notification.js';

const cache = new Map();

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() < entry.expiry) return entry.data;
  cache.delete(key);
  return null;
}

function setCache(key, data, ttlMs) {
  cache.set(key, { data, expiry: Date.now() + ttlMs });
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

export async function getCloudinaryMetrics() {
  const cached = getCached('cloudinary');
  if (cached) return cached;

  const usage = await cloudinary.api.usage();

  let totalAssets = 0;
  let images = 0;
  let videos = 0;
  const folders = {};

  try {
    const resources = await cloudinary.api.resources({
      max_results: 500,
    });

    totalAssets = resources.total_count || resources.resources.length;

    for (const r of resources.resources) {
      const isVideo = r.format === 'mp4' || r.format === 'webm';
      if (isVideo) videos++;
      else images++;

      const folder = r.folder || 'root';
      if (!folders[folder]) folders[folder] = { count: 0, bytes: 0 };
      folders[folder].count += 1;
      folders[folder].bytes += r.bytes || 0;
    }
  } catch (e) {
    console.warn('[Metrics] Cloudinary resource listing error:', e.message);
  }

  const used = usage.storage?.used || 0;
  const limit = usage.storage?.limit || 0;

  const result = {
    storage: {
      used,
      usedFormatted: formatBytes(used),
      limit,
      limitFormatted: formatBytes(limit),
      usagePercent: limit > 0 ? parseFloat(((used / limit) * 100).toFixed(2)) : 0,
    },
    assets: {
      total: totalAssets,
      images,
      videos,
    },
    folders,
  };

  setCache('cloudinary', result, 60000);
  return result;
}

export async function getMongoDBMetrics() {
  const cached = getCached('mongodb');
  if (cached) return cached;

  const db = mongoose.connection.db;
  const stats = await db.stats();

  const collections = await db.listCollections().toArray();
  let totalDocuments = 0;
  for (const col of collections) {
    const count = await db.collection(col.name).countDocuments();
    totalDocuments += count;
  }

  const result = {
    databaseSize: stats.dataSize || 0,
    databaseSizeFormatted: formatBytes(stats.dataSize || 0),
    storageSize: stats.storageSize || 0,
    storageSizeFormatted: formatBytes(stats.storageSize || 0),
    indexSize: stats.indexSize || 0,
    indexSizeFormatted: formatBytes(stats.indexSize || 0),
    collections: stats.collections || collections.length,
    totalDocuments,
    avgObjectSize: stats.avgObjSize || 0,
  };

  setCache('mongodb', result, 30000);
  return result;
}

export async function getStorageBreakdown() {
  const cached = getCached('storageBreakdown');
  if (cached) return cached;

  const content = await PortfolioContent.findOne();
  const projects = await Project.find();

  const projectImageCount = projects.filter(p => p.image).length;
  const heroImage = content?.hero?.image || '';
  const aboutImage = content?.about?.image || '';
  const testimonialItems = content?.testimonials?.items || [];
  const testimonialWithImage = testimonialItems.filter(t => t.image).length;

  let projectTotalSize = 0;
  let heroSize = 0;
  let aboutSize = 0;
  let testimonialSize = 0;

  try {
    const projectPublicIds = projects
      .filter(p => p.imagePublicId)
      .map(p => p.imagePublicId);

    if (projectPublicIds.length > 0) {
      const cloudResources = await cloudinary.api.resources_by_ids(projectPublicIds);
      projectTotalSize = cloudResources.resources.reduce((sum, r) => sum + (r.bytes || 0), 0);
    }

    const heroPublicId = content?.hero?.imagePublicId || '';
    if (heroPublicId) {
      const heroRes = await cloudinary.api.resource(heroPublicId);
      heroSize = heroRes.bytes || 0;
    }

    const aboutPublicId = content?.about?.imagePublicId || '';
    if (aboutPublicId) {
      const aboutRes = await cloudinary.api.resource(aboutPublicId);
      aboutSize = aboutRes.bytes || 0;
    }
  } catch (e) {
    console.warn('[Metrics] Cloudinary resource lookup error:', e.message);
  }

  const sections = [
    { name: 'Projects', count: projectImageCount, bytes: projectTotalSize, color: '#3B82F6' },
    { name: 'Testimonials', count: testimonialWithImage, bytes: testimonialSize, color: '#8B5CF6' },
    { name: 'Hero', count: heroImage ? 1 : 0, bytes: heroSize, color: '#10B981' },
    { name: 'About', count: aboutImage ? 1 : 0, bytes: aboutSize, color: '#F59E0B' },
  ];

  const totalBytes = sections.reduce((sum, s) => sum + s.bytes, 0);

  const result = {
    sections,
    totalBytes,
    totalFormatted: formatBytes(totalBytes),
    totalAssets: sections.reduce((sum, s) => sum + s.count, 0),
  };

  setCache('storageBreakdown', result, 60000);
  return result;
}

export async function getSystemHealth() {
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();

  const uptimeFormatted = formatUptime(uptime);
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memoryPercent = parseFloat(((usedMem / totalMem) * 100).toFixed(1));

  const cpus = os.cpus();
  const cpuCount = cpus.length;
  const cpuModel = cpus[0]?.model || 'N/A';
  const loadAvg = os.loadavg ? os.loadavg()[0] : 0;

  let status = 'healthy';
  if (memoryPercent > 85) status = 'warning';
  if (memoryPercent > 95) status = 'critical';

  const statusColors = { healthy: '#10B981', warning: '#F59E0B', critical: '#EF4444' };

  const result = {
    status,
    statusColor: statusColors[status],
    uptime,
    uptimeFormatted,
    memory: {
      rss: memoryUsage.rss,
      rssFormatted: formatBytes(memoryUsage.rss),
      heapUsed: memoryUsage.heapUsed,
      heapUsedFormatted: formatBytes(memoryUsage.heapUsed),
      heapTotal: memoryUsage.heapTotal,
      heapTotalFormatted: formatBytes(memoryUsage.heapTotal),
      external: memoryUsage.external,
      externalFormatted: formatBytes(memoryUsage.external),
    },
    systemMemory: {
      total: totalMem,
      totalFormatted: formatBytes(totalMem),
      free: freeMem,
      freeFormatted: formatBytes(freeMem),
      used: usedMem,
      usedFormatted: formatBytes(usedMem),
      percent: memoryPercent,
    },
    cpu: {
      count: cpuCount,
      model: cpuModel,
      loadAverage: loadAvg.toFixed(2),
    },
    nodeVersion: process.version,
    platform: os.platform(),
    arch: os.arch(),
    hostname: os.hostname(),
    environment: process.env.NODE_ENV || 'development',
  };

  return result;
}

export async function getOverviewMetrics() {
  const cached = getCached('overviewMetrics');
  if (cached) return cached;

  const [cloudMetrics, mongoMetrics, healthData, projects] = await Promise.all([
    getCloudinaryMetrics().catch(() => null),
    getMongoDBMetrics().catch(() => null),
    getSystemHealth().catch(() => null),
    Project.countDocuments().catch(() => 0),
  ]);

  const cloudStorage = cloudMetrics?.storage?.used || 0;
  const mongoStorage = mongoMetrics?.databaseSize || 0;
  const totalStorageBytes = cloudStorage + mongoStorage;

  const totalMedia = cloudMetrics?.assets?.total || 0;
  const serverStatus = healthData?.status || 'healthy';

  const result = {
    totalStorage: formatBytes(totalStorageBytes),
    totalStorageBytes,
    totalProjects: projects,
    totalMediaFiles: totalMedia,
    serverStatus,
    cloudinaryUsed: cloudMetrics?.storage?.usedFormatted || '0 B',
    mongoDbSize: mongoMetrics?.databaseSizeFormatted || '0 B',
  };

  setCache('overviewMetrics', result, 30000);
  return result;
}

export async function getStorageMetrics() {
  const cached = getCached('storageMetrics');
  if (cached) return cached;

  const [cloudMetrics, mongoMetrics, storageBreakdown] = await Promise.all([
    getCloudinaryMetrics().catch(() => null),
    getMongoDBMetrics().catch(() => null),
    getStorageBreakdown().catch(() => null),
  ]);

  const result = {
    cloudinary: cloudMetrics ? {
      used: cloudMetrics.storage.usedFormatted,
      limit: cloudMetrics.storage.limitFormatted,
      percent: cloudMetrics.storage.usagePercent,
      images: cloudMetrics.assets.images,
      videos: cloudMetrics.assets.videos,
      total: cloudMetrics.assets.total,
    } : null,
    mongodb: mongoMetrics ? {
      dataSize: mongoMetrics.databaseSizeFormatted,
      storageSize: mongoMetrics.storageSizeFormatted,
      collections: mongoMetrics.collections,
      documents: mongoMetrics.totalDocuments,
    } : null,
    projectAssets: storageBreakdown ? {
      totalSize: storageBreakdown.totalFormatted,
      totalFiles: storageBreakdown.totalAssets,
      sections: storageBreakdown.sections,
    } : null,
  };

  setCache('storageMetrics', result, 30000);
  return result;
}

export async function getSystemMetrics() {
  const healthData = await getSystemHealth();

  const cpus = os.cpus();
  const cpuLoad = os.loadavg ? os.loadavg()[0] : 0;
  const cpuPercent = cpuLoad > 0 ? parseFloat(((cpuLoad / cpus.length) * 100).toFixed(1)) : 0;

  const result = {
    cpu: {
      percent: Math.min(cpuPercent, 100),
      cores: cpus.length,
      model: cpus[0]?.model || 'N/A',
      loadAverage: cpuLoad.toFixed(2),
    },
    memory: {
      percent: healthData.systemMemory.percent,
      used: healthData.systemMemory.usedFormatted,
      total: healthData.systemMemory.totalFormatted,
      free: healthData.systemMemory.freeFormatted,
    },
    uptime: {
      seconds: healthData.uptime,
      formatted: healthData.uptimeFormatted,
    },
    status: healthData.status,
    nodeVersion: healthData.nodeVersion,
    environment: healthData.environment,
  };

  return result;
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);
  return parts.join(' ');
}
