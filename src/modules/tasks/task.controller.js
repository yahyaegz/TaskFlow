const { ZodError } = require('zod');
const HttpError = require('../../utils/http-error.js');
const { createTaskSchema, updateTaskSchema, querySchema } = require('./task.validation.js');

class TaskController {
  constructor(taskService) {
    this.service = taskService;
  }

  handleValidation(error) {
    if (error instanceof ZodError) {
      throw new HttpError(400, error.errors[0].message);
    }
    throw error;
  }

  createTask = async (req, res) => {
    try {
      const payload = createTaskSchema.parse(req.body);
      const task = await this.service.createTask(req.user.id, payload);
      return res.status(201).json({ success: true, data: task });
    } catch (error) {
      this.handleValidation(error);
    }
  }

  getTasks = async (req, res) => {
    try {
      const filters = querySchema.parse(req.query);
      const tasks = await this.service.getTasks(req.user.id, filters);
      return res.json({ success: true, data: tasks });
    } catch (error) {
      this.handleValidation(error);
    }
  }

  getTaskById = async (req, res) => {
    const task = await this.service.getTaskById(req.user.id, req.params.id);
    return res.json({ success: true, data: task });
  }

  updateTask = async (req, res) => {
    try {
      const payload = updateTaskSchema.parse(req.body);
      const task = await this.service.updateTask(req.user.id, req.params.id, payload);
      return res.json({ success: true, data: task });
    } catch (error) {
      this.handleValidation(error);
    }
  }

  deleteTask = async (req, res) => {
    await this.service.deleteTask(req.user.id, req.params.id);
    return res.status(204).send();
  }

  getStats = async (req, res) => {
    const stats = await this.service.getStats(req.user.id);
    return res.json({ success: true, data: stats });
  }

  getActivities = async (req, res) => {
    const activities = await this.service.getActivities(req.user.id);
    return res.json({ success: true, data: activities });
  }
}

module.exports = TaskController;
