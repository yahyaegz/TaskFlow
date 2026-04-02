const express = require('express');
const TaskRepository = require('./task.repository.js');
const TaskService = require('./task.service.js');
const TaskController = require('./task.controller.js');
const pool = require('../../db/pool.js');
const subtaskService = require('../subtasks/subtask.service.js');
const tagService = require('../tags/tag.service.js');
const notificationService = require('../notifications/notification.service.js');
const categoryService = require('../categories/category.service.js');
const activityRepository = require('../activity/activity.repository.js');
const estimatesService = require('../analytics/estimates.service.js');
const realtimeService = require('../realtime/realtime.service');

const asyncHandler = require('../../utils/async-handler.js');
const auth = require('../../middleware/auth.middleware.js');
const subtaskRoutes = require('../subtasks/subtask.routes.js');
const commentRoutes = require('../comments/comment.routes.js');

const repository = new TaskRepository(pool);
const service = new TaskService({ 
  repository, 
  subtaskService, 
  tagService, 
  notificationService,
  categoryService,
  activityRepository,
  estimatesService,
  realtimeService
});
const controller = new TaskController(service);

const router = express.Router();

router.use(auth);

// Nest subtasks and comments under tasks
router.use('/:taskId/subtasks', subtaskRoutes);
router.use('/:taskId/comments', commentRoutes);

router.get('/activities', asyncHandler(controller.getActivities));
router.get('/stats', asyncHandler(controller.getStats));
router.get('/', asyncHandler(controller.getTasks));
router.get('/:id', asyncHandler(controller.getTaskById));
router.post('/', asyncHandler(controller.createTask));
router.patch('/:id', asyncHandler(controller.updateTask));
router.delete('/:id', asyncHandler(controller.deleteTask));

module.exports = router;
