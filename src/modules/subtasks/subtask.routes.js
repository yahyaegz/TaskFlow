const express = require('express');
const controller = require('./subtask.controller.js');
const auth = require('../../middleware/auth.middleware.js');

const router = express.Router({ mergeParams: true });

// auth is already applied by the parent task.routes.js

router.get('/', controller.getSubtasks);
router.post('/', controller.createSubtask);
router.put('/:id', controller.updateSubtask);
router.delete('/:id', controller.deleteSubtask);

module.exports = router;
