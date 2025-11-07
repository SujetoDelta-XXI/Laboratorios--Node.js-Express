import jwt from 'jsonwebtoken';
import userRepository from '../repositories/UserRepository.js';

export default async function authenticate(req, res, next) {
  try {
    let token = null;

    // header o cookie
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      token = header.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'No autorizado: falta token' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // usuario con roles poblados
    const user = await userRepository.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    req.user = user;
    req.userId = user._id;
    req.userRoles = (user.roles || []).map(r => r.name); 

    next();
  } catch {
    return res.status(401).json({ message: 'Token no válido o caducado' });
  }
}
