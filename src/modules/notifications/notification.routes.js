const express = require('express');
const controller = require('./notification.controller.js');
const auth = require('../../middleware/auth.middleware.js');
const asyncHandler = require('../../utils/async-handler.js');

const router = express.Router();

router.use(auth);

router.get('/', asyncHandler(controller.getNotifications));
router.patch('/read-all', asyncHandler(controller.markAllAsRead));
router.patch('/:id/read', asyncHandler(controller.markAsRead));
router.delete('/all', asyncHandler(controller.deleteAllNotifications));

module.exports = router;
