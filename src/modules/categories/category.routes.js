const express = require('express');
const controller = require('./category.controller.js');
const auth = require('../../middleware/auth.middleware.js');

const router = express.Router();

router.use(auth);

router.get('/', controller.getCategories);
router.post('/', controller.createCategory);
router.put('/:id', controller.updateCategory);
router.delete('/:id', controller.deleteCategory);

module.exports = router;
