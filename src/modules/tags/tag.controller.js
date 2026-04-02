const service = require('./tag.service.js');
const asyncHandler = require('../../utils/async-handler.js');
const { createTagSchema } = require('./tag.validation.js');

const getTags = asyncHandler(async (req, res) => {
  const tags = await service.getTags(req.user.id);
  res.json({ success: true, data: tags });
});

const createTag = asyncHandler(async (req, res) => {
  const validatedData = createTagSchema.parse(req.body);
  const tag = await service.createTag(req.user.id, validatedData);
  res.status(201).json({ success: true, data: tag });
});

const deleteTag = asyncHandler(async (req, res) => {
  await service.deleteTag(req.user.id, req.params.id);
  res.json({ success: true, message: 'Tag deleted' });
});

module.exports = {
  getTags,
  createTag,
  deleteTag,
};
