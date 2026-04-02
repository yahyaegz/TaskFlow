const repository = require('./category.repository.js');
const HttpError = require('../../utils/http-error.js');

async function getCategories(userId) {
  return repository.findAll(userId);
}

async function createCategory(userId, data) {
  return repository.create(userId, data);
}

async function updateCategory(userId, id, data) {
  const category = await repository.update(userId, id, data);
  if (!category) {
    throw new HttpError(404, 'Category not found');
  }
  return category;
}

async function deleteCategory(userId, id) {
  const deleted = await repository.remove(userId, id);
  if (!deleted) {
    throw new HttpError(404, 'Category not found');
  }
}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
