import userRepository from '../repositories/UserRepository.js';

class UserService {
  async getAll() {
    return userRepository.findAll(); 
  }

  async getById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      const err = new Error('Usuario no encontrado');
      err.status = 404;
      throw err;
    }
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      roles: (user.roles || []).map(r => r.name),
    };
  }
}

export default new UserService();
