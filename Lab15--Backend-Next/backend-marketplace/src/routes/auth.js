const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/logout', (req, res) => {
	res.clearCookie('token');
	res.json({ message: 'Logged out' });
});

router.get('/me', async (req, res) => {
	// Try to read token from cookie
	const jwt = require('jsonwebtoken');
	const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
	const token = req.cookies && req.cookies.token;
	if (!token) return res.status(401).json({ error: 'No autorizado' });
	try {
		const payload = jwt.verify(token, JWT_SECRET);
		res.json({ user: { id: payload.id, email: payload.email, role: payload.role } });
	} catch (err) {
		res.status(401).json({ error: 'Token inválido' });
	}
});

module.exports = router;
