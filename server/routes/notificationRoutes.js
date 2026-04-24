import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  getNotifications,
  markAsRead,
  getUnreadCount,
} from '../controllers/notificationController.js';

const router = express.Router();

// All routes are protected (Admin only)
router.use(protect);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/:id/read', markAsRead);

export default router;
