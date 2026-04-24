import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { getStats, getActivity } from '../controllers/dashboardController.js';

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard stats
// @access  Admin
router.get('/stats', protect, getStats);

// @route   GET /api/dashboard/activity
// @desc    Get dashboard activity
// @access  Admin
router.get('/activity', protect, getActivity);

export default router;
