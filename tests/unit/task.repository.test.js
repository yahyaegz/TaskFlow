import { describe, it, expect, vi, beforeEach } from 'vitest';
const TaskRepository = require('../../src/modules/tasks/task.repository');

describe('TaskRepository', () => {
  let repository;
  let mockPool;

  beforeEach(() => {
    mockPool = {
      query: vi.fn(),
    };
    repository = new TaskRepository(mockPool);
  });

  it('should find all tasks for a user', async () => {
    const userId = 'user-123';
    const mockTasks = [
      { id: '1', title: 'Task 1', user_id: userId },
      { id: '2', title: 'Task 2', user_id: userId },
    ];

    mockPool.query.mockResolvedValueOnce({ rows: mockTasks });

    const result = await repository.findAll(userId, {});

    expect(mockPool.query).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('Task 1');
  });

  it('should create a new task', async () => {
    const userId = 'user-123';
    const taskData = { title: 'New Task', status: 'todo' };
    const mockCreatedTask = { id: '3', ...taskData, user_id: userId };

    mockPool.query.mockResolvedValueOnce({ rows: [mockCreatedTask] });

    const result = await repository.createTask(userId, taskData);

    expect(mockPool.query).toHaveBeenCalled();
    expect(result.title).toBe('New Task');
  });

  it('should delete a task', async () => {
    const userId = 'user-123';
    const taskId = 'task-123';

    mockPool.query.mockResolvedValueOnce({ rowCount: 1 });

    const result = await repository.deleteTask(userId, taskId);

    expect(mockPool.query).toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
