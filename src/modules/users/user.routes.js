const express = require('express');
const controller = require('./user.controller.js');
const asyncHandler = require('../../utils/async-handler.js');
const auth = require('../../middleware/auth.middleware.js');

const router = express.Router();

router.put('/me', auth, asyncHandler(controller.updateMe));
router.post('/change-password', auth, asyncHandler(controller.changePassword));
router.get('/export', auth, asyncHandler(controller.exportData));

module.exports = router;
