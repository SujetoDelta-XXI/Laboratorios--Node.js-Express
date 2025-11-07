import userRepository from '../repositories/UserRepository.js';

class UsersController {
  async getAll(req, res, next) {
    try {
      // Verificamos rol admin
      const isAdmin = req.user?.roles?.some(r => r.name === 'admin');
      if (!isAdmin) {
        return res.status(403).json({ message: 'Acceso denegado' });
      }

      const users = await userRepository.findAll().select('-password');
      const usersData = users.map(u => ({
        ...u.toObject(),
        roles: (u.roles || []).map(r => r.name)
      }));
      res.json(usersData);
    } catch (err) {
      next(err);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await userRepository.findById(req.userId).select('-password');
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      const userData = {
        ...user.toObject(),
        roles: (user.roles || []).map(r => r.name)
      };
      res.json(userData);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await userRepository.findById(req.params.id).select('-password');
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      res.json({
        ...user.toObject(),
        roles: (user.roles || []).map(r => r.name)
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new UsersController();
