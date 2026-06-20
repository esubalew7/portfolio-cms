import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  getNotifications,
  getNotification,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
  deleteAllNotifications,
} from '../controllers/notificationController.js';

const router = express.Router();

// All routes are protected (Admin only)
router.use(protect);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllAsRead);
router.get('/:id', getNotification);
router.put('/:id/read', markAsRead);
router.delete('/', deleteAllNotifications);
router.delete('/:id', deleteNotification);

export default router;
