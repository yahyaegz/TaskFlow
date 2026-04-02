const { z } = require('zod');

const createSubtaskSchema = z.object({
  title: z.string().min(1).max(255),
});

const updateSubtaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  completed: z.boolean().optional(),
});

module.exports = {
  createSubtaskSchema,
  updateSubtaskSchema,
};
