import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

class AuthService {

  async signUp({ 
      email, 
      password, 
      name, 
      lastName, 
      phoneNumber, 
      birthdate, 
      url_profile = '', 
      adress = '', 
      roles = ['user'] 
  }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      const err = new Error('El email ya se encuentra en uso');
      err.status = 400;
      throw err;
    }

    // Encriptar password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
    const hashed = await bcrypt.hash(password, saltRounds);

    // Asignar roles
    const roleDocs = [];
    for (const r of roles) {
      let roleDoc = await roleRepository.findByName(r);
      if (!roleDoc) roleDoc = await roleRepository.create({ name: r });
      roleDocs.push(roleDoc._id);
    }

    // ✅ Crear usuario con todos los campos
    const user = await userRepository.create({ 
      email, 
      password: hashed, 
      name, 
      lastName, 
      phoneNumber, 
      birthdate, 
      url_profile, 
      adress,
      roles: roleDocs 
    });

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      birthdate: user.birthdate,
      url_profile: user.url_profile,
      adress: user.adress
    };
  }

  async signIn({ email, password }) {
    // Busca el usuario y popula los roles para obtener los nombres
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const err = new Error('Credenciales inválidas');
      err.status = 401;
      throw err;
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      const err = new Error('Credenciales inválidas');
      err.status = 401;
      throw err;
    }

    // Si los roles son ObjectId, popula los nombres
    let roleNames = [];
    if (user.roles && user.roles.length && typeof user.roles[0] !== 'string') {
      const populatedUser = await userRepository.findById(user._id);
      roleNames = (populatedUser.roles || []).map(r => r.name);
    } else {
      roleNames = user.roles;
    }

    const token = jwt.sign(
      { sub: user._id, roles: roleNames },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return { token };
  }
}

export default new AuthService();