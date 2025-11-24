const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// ================= REGISTRO =================
exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Usuario ya existe' });
    }

    const hash = await bcrypt.hash(password, 10);

    const customerRole = await Role.findOne({ where: { name: 'CUSTOMER' } });
    const roleId = customerRole ? customerRole.id : null;

    const user = await User.create({
      nombre,
      email,
      passwordHash: hash,
      RoleId: roleId
    });

    const userWithRole = await User.findByPk(user.id, {
      include: [{ model: Role }]
    });

    const payload = {
      id: user.id,
      email: user.email,
      role: userWithRole?.Role?.name || null
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    // ✅ CONFIGURACIÓN CORRECTA PARA PRODUCCIÓN
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Registrado correctamente',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: payload.role
      }
    });

  } catch (err) {
    console.error('Error register:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan credenciales' });
    }

    const user = await User.findOne({
      where: { email },
      include: [{ model: Role }]
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.Role ? user.Role.name : null
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    // ✅ FIX DEFINITIVO PARA COOKIES EN PRODUCCIÓN
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Autenticado correctamente',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: payload.role
      }
    });

  } catch (err) {
    console.error('Error login:', err);
    res.status(500).json({ error: 'Error de servidor' });
  }
};
