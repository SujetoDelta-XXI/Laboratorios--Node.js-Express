const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Logout is handled client-side by removing stored token. Keep endpoint for compatibility.
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out (client should remove token)' });
});

router.get('/me', async (req, res) => {
  // Read token from Authorization header (Bearer)
  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
  const auth = req.headers && req.headers.authorization;
  const token = auth && typeof auth === 'string' && auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    res.json({ user: { id: payload.id, email: payload.email, role: payload.role } });
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

module.exports = router;
