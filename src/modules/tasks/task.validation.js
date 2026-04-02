const { z } = require('zod');

const priorityEnum = z.enum(['low', 'medium', 'high']);
const statusEnum = z.enum(['todo', 'in_progress', 'done']);

const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().trim().optional().nullable(),
  priority: priorityEnum.default('medium'),
  status: statusEnum.default('todo'),
  dueDate: z.string().date().or(z.literal('')).optional().nullable(),
  categoryId: z.string().uuid().or(z.literal('')).optional().nullable(),
  assigneeId: z.string().uuid().or(z.literal('')).optional().nullable(),
});

const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1, 'Title cannot be empty').max(255, 'Title is too long').optional(),
    description: z.string().trim().optional().nullable(),
    priority: priorityEnum.optional(),
    status: statusEnum.optional(),
    dueDate: z.string().date().or(z.literal('')).optional().nullable(),
    categoryId: z.string().uuid().or(z.literal('')).optional().nullable(),
    assigneeId: z.string().uuid().or(z.literal('')).optional().nullable(),
    completed: z.boolean().optional(),
    tags: z.array(z.string().uuid()).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided for update',
  });

const querySchema = z.object({
  status: z.union([statusEnum, z.literal('all')]).optional().default('all'),
  priority: priorityEnum.optional(),
  categoryId: z.string().uuid().optional(),
  sort: z.enum(['createdAt', 'dueDate', 'priority']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  search: z.string().trim().optional().default(''),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  querySchema,
};
