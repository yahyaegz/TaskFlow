const HttpError = require('../../utils/http-error.js');

class TaskService {
  constructor({ repository, subtaskService, tagService, notificationService, categoryService, activityRepository, estimatesService, realtimeService }) {
    this.repository = repository;
    this.subtaskService = subtaskService;
    this.tagService = tagService;
    this.notificationService = notificationService;
    this.categoryService = categoryService;
    this.activityRepository = activityRepository;
    this.estimatesService = estimatesService;
    this.realtimeService = realtimeService;
  }

  async createTask(userId, data) {
    // Clean data
    const cleanedData = { ...data };
    if (cleanedData.categoryId === '') cleanedData.categoryId = null;
    if (cleanedData.assigneeId === '') cleanedData.assigneeId = null;
    if (cleanedData.dueDate === '') cleanedData.dueDate = null;

    const task = await this.repository.createTask(userId, cleanedData);
    
    if (this.realtimeService) {
      this.realtimeService.broadcastTaskCreated(userId, task);
    }

    try {
      if (this.activityRepository) {
        await this.activityRepository.logActivity(userId, task.id, 'create_task', { title: task.title });
      }
      if (this.notificationService) {
        await this.notificationService.createNotification(userId, {
          type: 'info',
          title: 'Task Created',
          message: `You successfully created: "${task.title}"`,
          link: `/tasks/${task.id}`
        });
      }
    } catch (error) {
      console.error('Notification creation failed:', error);
    }
    
    return task;
  }

  async getTasks(userId, filters) {
    return this.repository.findAll(userId, filters);
  }

  async getTaskById(userId, id) {
    const task = await this.repository.findById(userId, id);
    if (!task) {
      throw new HttpError(404, 'Task not found');
    }
    
    // Fetch related data
    const subtasks = this.subtaskService ? await this.subtaskService.getSubtasks(id) : [];
    const tags = this.tagService ? await this.tagService.getTaskTags(id) : [];
    
    let predictedCompletionTime = null;
    if (this.estimatesService && !task.completed) {
      predictedCompletionTime = await this.estimatesService.getPredictedCompletionTime(userId, task.priority);
    }
    
    return { ...task, subtasks, tags, predictedCompletionTime };
  }

  async updateTask(userId, id, data) {
    const existingTask = await this.repository.findById(userId, id);
    if (!existingTask) {
      throw new HttpError(404, 'Task not found');
    }

    // Clean data
    const cleanedData = { ...data };
    if (cleanedData.categoryId === '') cleanedData.categoryId = null;
    if (cleanedData.assigneeId === '') cleanedData.assigneeId = null;
    if (cleanedData.dueDate === '') cleanedData.dueDate = null;

    // Handle tag updates separately if provided
    if (cleanedData.tags && this.tagService) {
      await this.tagService.updateTaskTags(id, cleanedData.tags);
      delete cleanedData.tags;
    }

    const updatedTask = await this.repository.updateTask(userId, id, cleanedData);

    if (this.realtimeService) {
      this.realtimeService.broadcastTaskUpdated(userId, updatedTask);
    }

    try {
      if (this.activityRepository) {
        if (cleanedData.status === 'done' && existingTask.status !== 'done') {
          await this.activityRepository.logActivity(userId, id, 'complete_task', { title: updatedTask.title });
        }
      }
    } catch (error) {
      console.error('Activity logging failed:', error);
    }

    return updatedTask;
  }

  async deleteTask(userId, id) {
    const existingTask = await this.repository.findById(userId, id);
    const deleted = await this.repository.deleteTask(userId, id);
    if (!deleted) {
      throw new HttpError(404, 'Task not found');
    }

    if (this.realtimeService) {
      this.realtimeService.broadcastTaskDeleted(userId, id);
    }

    try {
      if (this.activityRepository) {
        await this.activityRepository.logActivity(userId, null, 'delete_task', { title: existingTask.title });
      }
    } catch (error) {
      console.error('Activity logging failed:', error);
    }
  }

  async getActivities(userId) {
    return this.activityRepository ? this.activityRepository.getActivities(userId) : [];
  }

  async getStats(userId) {
    return this.repository.getStats(userId);
  }
}

module.exports = TaskService;
