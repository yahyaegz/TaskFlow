const { ZodError } = require('zod');
const service = require('./notification.service.js');
const HttpError = require('../../utils/http-error.js');
const { querySchema } = require('./notification.validation.js');

function handleValidation(error) {
  if (error instanceof ZodError) {
    throw new HttpError(400, 'Validation failed', error.flatten());
  }
  throw error;
}

async function getNotifications(req, res) {
  try {
    const filters = querySchema.parse(req.query);
    const notifications = await service.getNotifications(req.user.id, filters);
    return res.json({ success: true, data: notifications });
  } catch (error) {
    handleValidation(error);
  }
}

async function markAsRead(req, res) {
  const notification = await service.markAsRead(req.user.id, req.params.id);
  return res.json({ success: true, data: notification });
}

async function markAllAsRead(req, res) {
  await service.markAllAsRead(req.user.id);
  return res.json({ success: true, message: 'All notifications marked as read' });
}

async function deleteAllNotifications(req, res) {
  await service.deleteAllNotifications(req.user.id);
  return res.json({ success: true, message: 'All notifications deleted' });
}

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteAllNotifications,
};
