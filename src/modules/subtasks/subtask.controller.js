const service = require('./subtask.service.js');
const asyncHandler = require('../../utils/async-handler.js');
const { createSubtaskSchema, updateSubtaskSchema } = require('./subtask.validation.js');

const getSubtasks = asyncHandler(async (req, res) => {
  const subtasks = await service.getSubtasks(req.params.taskId);
  res.json({ success: true, data: subtasks });
});

const createSubtask = asyncHandler(async (req, res) => {
  const validatedData = createSubtaskSchema.parse(req.body);
  const subtask = await service.createSubtask(req.params.taskId, validatedData);
  res.status(201).json({ success: true, data: subtask });
});

const updateSubtask = asyncHandler(async (req, res) => {
  const validatedData = updateSubtaskSchema.parse(req.body);
  const subtask = await service.updateSubtask(req.params.id, validatedData);
  res.json({ success: true, data: subtask });
});

const deleteSubtask = asyncHandler(async (req, res) => {
  await service.deleteSubtask(req.params.id);
  res.json({ success: true, message: 'Subtask deleted' });
});

module.exports = {
  getSubtasks,
  createSubtask,
  updateSubtask,
  deleteSubtask,
};
