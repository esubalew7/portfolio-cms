import Notification from '../models/Notification.js';
import { emitNotificationCreated } from '../socket/emitters.js';

export async function createNotification({ type, title, description, message, relatedId, relatedModel }) {
  const notification = await Notification.create({
    type,
    title,
    description: description || '',
    message: message || '',
    relatedId: relatedId || undefined,
    relatedModel: relatedModel || null,
  });

  emitNotificationCreated(notification);

  return notification;
}
