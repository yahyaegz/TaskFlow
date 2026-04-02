const express = require('express');
const controller = require('./tag.controller.js');
const auth = require('../../middleware/auth.middleware.js');

const router = express.Router();

router.use(auth);

router.get('/', controller.getTags);
router.post('/', controller.createTag);
router.delete('/:id', controller.deleteTag);

module.exports = router;
