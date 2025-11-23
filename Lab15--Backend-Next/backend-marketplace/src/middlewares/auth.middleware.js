const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

async function authenticateToken(req, res, next) {
  // Try header first, then cookie
  const auth = req.headers.authorization;
  let token = null;
  if (auth && auth.startsWith('Bearer ')) token = auth.split(' ')[1];
  if (!token && req.cookies && req.cookies.token) token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // attach user info
    const user = await User.findByPk(payload.id, { include: [{ model: Role }] });
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
    req.user = { id: user.id, email: user.email, role: user.Role ? user.Role.name : null };
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = { authenticateToken };
