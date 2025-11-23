const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

router.get('/dashboard', authenticateToken, authorizeRoles('ADMIN'), (req, res) => {
  res.json({ message: 'Bienvenido al panel admin', user: req.user });
});

module.exports = router;
