const express = require('express');
const controller = require('./analytics.controller.js');
const auth = require('../../middleware/auth.middleware.js');
const asyncHandler = require('../../utils/async-handler.js');

const router = express.Router();

router.use(auth);

router.get('/productivity', asyncHandler(controller.getProductivity));

module.exports = router;
