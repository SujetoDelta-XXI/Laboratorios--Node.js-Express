const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

router.get('/', categoryController.getAllCategories);
router.post('/', authenticateToken, authorizeRoles('ADMIN'), categoryController.createCategory);
router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), categoryController.updateCategory);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), categoryController.deleteCategory);

module.exports = router;
