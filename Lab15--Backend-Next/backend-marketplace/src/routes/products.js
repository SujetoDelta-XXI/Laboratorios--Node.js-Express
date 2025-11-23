const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', authenticateToken, authorizeRoles('ADMIN'), productController.createProduct);
router.put('/:id', authenticateToken, authorizeRoles('ADMIN'), productController.updateProduct);
router.delete('/:id', authenticateToken, authorizeRoles('ADMIN'), productController.deleteProduct);

module.exports = router;
