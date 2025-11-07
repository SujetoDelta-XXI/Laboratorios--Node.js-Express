import bcrypt from 'bcrypt';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';


export default async function seedUsers() {
  try {
    // ── 1. Verificar y crear roles ──────────────────────────────
    const adminRole =
      (await roleRepository.findByName('admin')) ||
      (await roleRepository.create({ name: 'admin' }));

    const userRole =
      (await roleRepository.findByName('user')) ||
      (await roleRepository.create({ name: 'user' }));

    // ── 2. Usuarios iniciales con todos los campos ─────────────
    const usersToSeed = [
      {
        name: 'Carlos',
        lastName: 'Administrador',
        email: 'admin@demo.com',
        password: 'Admin#2025',
        phoneNumber: '999111222',
        birthdate: new Date('1990-03-15'),
        url_profile: 'https://via.placeholder.com/150?text=Admin',
        adress: 'Av. Siempre Viva 123, Lima, Perú',
        roles: [adminRole._id]
      },
      {
        name: 'Lucía',
        lastName: 'Usuario',
        email: 'user@demo.com',
        password: 'User#2025',
        phoneNumber: '988555444',
        birthdate: new Date('2002-07-20'),
        url_profile: 'https://via.placeholder.com/150?text=User',
        adress: 'Jr. Los Cedros 456, Lima, Perú',
        roles: [userRole._id]
      }
    ];

    // ── 3. Crear los usuarios si no existen ───────────────────
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);

    for (const u of usersToSeed) {
      const exists = await userRepository.findByEmail(u.email);

      if (!exists) {
        const hashedPassword = await bcrypt.hash(u.password, saltRounds);

        await userRepository.create({
          name: u.name,
          lastName: u.lastName,
          email: u.email,
          password: hashedPassword,
          phoneNumber: u.phoneNumber,
          birthdate: u.birthdate,
          url_profile: u.url_profile,
          adress: u.adress,
          roles: u.roles
        });

        console.log(`✅ Usuario creado: ${u.email}`);
      } else {
        console.log(`ℹ️ Usuario ya existe: ${u.email}`);
      }
    }
  } catch (error) {
    console.error('❌ Error al sembrar usuarios iniciales:', error);
  }
}
