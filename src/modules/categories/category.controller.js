const service = require('./category.service.js');
const asyncHandler = require('../../utils/async-handler.js');
const { createCategorySchema, updateCategorySchema } = require('./category.validation.js');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await service.getCategories(req.user.id);
  res.json({ success: true, data: categories });
});

const createCategory = asyncHandler(async (req, res) => {
  const validatedData = createCategorySchema.parse(req.body);
  const category = await service.createCategory(req.user.id, validatedData);
  res.status(201).json({ success: true, data: category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const validatedData = updateCategorySchema.parse(req.body);
  const category = await service.updateCategory(req.user.id, req.params.id, validatedData);
  res.json({ success: true, data: category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  await service.deleteCategory(req.user.id, req.params.id);
  res.json({ success: true, message: 'Category deleted' });
});

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
