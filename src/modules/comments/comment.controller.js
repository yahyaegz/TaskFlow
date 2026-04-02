const repository = require('./comment.repository.js');

async function getComments(req, res) {
  const { taskId } = req.params;
  const comments = await repository.findByTaskId(taskId);
  res.json({ success: true, data: comments });
}

async function createComment(req, res) {
  const { taskId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  if (!content) {
    return res.status(400).json({ success: false, error: 'Content is required' });
  }

  const newComment = await repository.create({ taskId, userId, content });
  
  // Attach user details to the response to match findByTaskId structure
  newComment.user_name = req.user.name;

  res.status(201).json({ success: true, data: newComment });
}

async function deleteComment(req, res) {
  const { id } = req.params;
  const result = await repository.deleteById(id);
  if (!result) return res.status(404).json({ success: false, error: 'Comment not found' });
  res.json({ success: true, data: { message: 'Comment deleted successfully' } });
}

module.exports = {
  getComments,
  createComment,
  deleteComment,
};
