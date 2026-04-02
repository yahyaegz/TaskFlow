const bcrypt = require('bcryptjs');
const userRepository = require('./user.repository.js');
const taskRepositoryModule = require('../tasks/task.repository.js');
const pool = require('../../db/pool.js');
const HttpError = require('../../utils/http-error.js');

// Instantiate taskRepository for export
const taskRepository = new taskRepositoryModule(pool);

async function updateMe(req, res) {
  const { name, email, notification_preferences, view_preference } = req.body;
  const userId = req.user.id;

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;
  if (notification_preferences !== undefined) updates.notification_preferences = notification_preferences;
  if (view_preference !== undefined) updates.view_preference = view_preference;

  if (Object.keys(updates).length === 0) {
    throw new HttpError(400, 'No valid fields provided for update');
  }

  if (email && email !== req.user.email) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new HttpError(409, 'Email already in use');
    }
  }

  const updatedUser = await userRepository.update(userId, updates);

  if (!updatedUser) {
    throw new HttpError(404, 'User not found');
  }

  res.json({
    success: true,
    data: {
      user: updatedUser,
    },
  });
}

async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword) {
    throw new HttpError(400, 'Current and new passwords are required');
  }

  const user = await userRepository.findFullById(userId);
  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  const isValid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isValid) {
    throw new HttpError(401, 'Invalid current password');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  await userRepository.updatePassword(userId, passwordHash);

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
}

async function exportData(req, res) {
  const userId = req.user.id;
  const format = req.query.format || 'json';
  
  const tasks = await taskRepository.findAllRaw(userId);
  
  if (format === 'csv') {
    const headers = ['id', 'title', 'status', 'priority', 'due_date', 'category_name', 'completed', 'created_at'];
    const rows = tasks.map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.status,
      t.priority,
      t.due_date || '',
      t.category_name || '',
      t.completed,
      t.created_at
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=taskflow_export_${new Date().toISOString().split('T')[0]}.csv`);
    return res.send(csvContent);
  }
  
  // Default JSON
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=taskflow_export_${new Date().toISOString().split('T')[0]}.json`);
  res.json({
    user: {
      name: req.user.name,
      email: req.user.email,
      exported_at: new Date().toISOString()
    },
    tasks
  });
}

module.exports = {
  updateMe,
  changePassword,
  exportData
};
