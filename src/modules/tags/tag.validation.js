const { z } = require('zod');

const createTagSchema = z.object({
  name: z.string().min(1).max(30),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
});

module.exports = {
  createTagSchema,
};
