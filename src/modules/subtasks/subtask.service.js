const repository = require('./subtask.repository.js');
const HttpError = require('../../utils/http-error.js');

async function getSubtasks(taskId) {
  return repository.findByTaskId(taskId);
}

async function createSubtask(taskId, data) {
  return repository.create(taskId, data);
}

async function updateSubtask(id, data) {
  const subtask = await repository.update(id, data);
  if (!subtask) {
    throw new HttpError(404, 'Subtask not found');
  }
  return subtask;
}

async function deleteSubtask(id) {
  const deleted = await repository.remove(id);
  if (!deleted) {
    throw new HttpError(404, 'Subtask not found');
  }
}

module.exports = {
  getSubtasks,
  createSubtask,
  updateSubtask,
  deleteSubtask,
};
