const repository = require('./notification.repository.js');
const HttpError = require('../../utils/http-error.js');

async function getNotifications(userId, filters) {
  return await repository.getNotifications(userId, filters);
}

async function markAsRead(userId, notificationId) {
  const notification = await repository.markAsRead(userId, notificationId);
  if (!notification) throw new HttpError(404, 'Notification not found');
  return notification;
}

async function markAllAsRead(userId) {
  return await repository.markAllAsRead(userId);
}

async function deleteAllNotifications(userId) {
  return await repository.deleteAllNotifications(userId);
}

async function createNotification(userId, data) {
  return await repository.createNotification(userId, data);
}

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteAllNotifications,
  createNotification,
};
