const express = require('express');
const controller = require('./comment.controller.js');
const asyncHandler = require('../../utils/async-handler.js');

const router = express.Router({ mergeParams: true });

// Note: auth middleware is applied at the parent level in task.routes.js 
router.get('/', asyncHandler(controller.getComments));
router.post('/', asyncHandler(controller.createComment));
router.delete('/:id', asyncHandler(controller.deleteComment));

module.exports = router;
