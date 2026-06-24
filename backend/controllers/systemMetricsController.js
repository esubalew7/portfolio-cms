import * as metricsService from '../services/systemMetricsService.js';
import { getPerformanceMetrics } from '../middleware/performanceLogger.js';

export async function getCloudinaryMetrics(req, res) {
  try {
    const data = await metricsService.getCloudinaryMetrics();
    res.json({ success: true, data });
  } catch (error) {
    console.error('[Metrics] Cloudinary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Cloudinary metrics',
      error: error.message,
    });
  }
}

export async function getMongoDBMetrics(req, res) {
  try {
    const data = await metricsService.getMongoDBMetrics();
    res.json({ success: true, data });
  } catch (error) {
    console.error('[Metrics] MongoDB error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch MongoDB metrics',
      error: error.message,
    });
  }
}

export async function getApiPerformance(req, res) {
  try {
    const data = getPerformanceMetrics();
    res.json({ success: true, data });
  } catch (error) {
    console.error('[Metrics] Performance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch API performance metrics',
      error: error.message,
    });
  }
}

export async function getStorageBreakdown(req, res) {
  try {
    const data = await metricsService.getStorageBreakdown();
    res.json({ success: true, data });
  } catch (error) {
    console.error('[Metrics] Storage breakdown error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch storage breakdown',
      error: error.message,
    });
  }
}

export async function getSystemHealth(req, res) {
  try {
    const data = await metricsService.getSystemHealth();
    res.json({ success: true, data });
  } catch (error) {
    console.error('[Metrics] Health error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system health',
      error: error.message,
    });
  }
}

export async function getOverviewMetrics(req, res) {
  try {
    const data = await metricsService.getOverviewMetrics();
    res.json({ success: true, data });
  } catch (error) {
    console.error('[Metrics] Overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overview metrics',
      error: error.message,
    });
  }
}

export async function getStorageMetrics(req, res) {
  try {
    const data = await metricsService.getStorageMetrics();
    res.json({ success: true, data });
  } catch (error) {
    console.error('[Metrics] Storage error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch storage metrics',
      error: error.message,
    });
  }
}

export async function getSystemMetrics(req, res) {
  try {
    const data = await metricsService.getSystemMetrics();
    res.json({ success: true, data });
  } catch (error) {
    console.error('[Metrics] System error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system metrics',
      error: error.message,
    });
  }
}
