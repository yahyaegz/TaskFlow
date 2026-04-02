const repository = require('./tag.repository.js');
const HttpError = require('../../utils/http-error.js');

async function getTags(userId) {
  return repository.findAll(userId);
}

async function createTag(userId, data) {
  return repository.create(userId, data);
}

async function deleteTag(userId, id) {
  const deleted = await repository.remove(userId, id);
  if (!deleted) {
    throw new HttpError(404, 'Tag not found');
  }
}

async function getTaskTags(taskId) {
  return repository.getTaskTags(taskId);
}

async function updateTaskTags(taskId, tagIds) {
  return repository.updateTaskTags(taskId, tagIds);
}

module.exports = {
  getTags,
  createTag,
  deleteTag,
  getTaskTags,
  updateTaskTags,
};
