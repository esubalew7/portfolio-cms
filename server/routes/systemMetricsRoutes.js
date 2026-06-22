import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { performanceLogger } from '../middleware/performanceLogger.js';
import {
  getCloudinaryMetrics,
  getMongoDBMetrics,
  getApiPerformance,
  getStorageBreakdown,
  getSystemHealth,
  getOverviewMetrics,
  getStorageMetrics,
  getSystemMetrics,
} from '../controllers/systemMetricsController.js';

const router = express.Router();

router.use(performanceLogger);

router.use(protect);

router.get('/cloudinary', getCloudinaryMetrics);
router.get('/mongodb', getMongoDBMetrics);
router.get('/api-performance', getApiPerformance);
router.get('/storage-breakdown', getStorageBreakdown);
router.get('/health', getSystemHealth);
router.get('/overview', getOverviewMetrics);
router.get('/storage', getStorageMetrics);
router.get('/system', getSystemMetrics);

export default router;
