const bcrypt = require('bcrypt');
const Role = require('../models/Role');
const User = require('../models/User');

async function seed() {
  try {
    const [adminRole] = await Role.findOrCreate({ where: { name: 'ADMIN' }, defaults: { name: 'ADMIN' } });
    const [customerRole] = await Role.findOrCreate({ where: { name: 'CUSTOMER' }, defaults: { name: 'CUSTOMER' } });

    // Check admin user
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
    const adminPass = process.env.SEED_ADMIN_PASSWORD || 'adminpass';

    const existing = await User.findOne({ where: { email: adminEmail } });
    if (!existing) {
      const hash = await bcrypt.hash(adminPass, 10);
      await User.create({ nombre: 'Admin', email: adminEmail, passwordHash: hash, RoleId: adminRole.id });
      console.log('Usuario admin creado:', adminEmail);
    }
  } catch (err) {
    console.error('Error en seeder:', err);
  }
}

module.exports = seed;
