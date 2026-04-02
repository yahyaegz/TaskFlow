const { z } = require('zod');

const querySchema = z.object({
  unreadOnly: z.string().optional().transform(val => val === 'true'),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

module.exports = {
  querySchema,
};
