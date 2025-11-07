import roleRepository from '../repositories/RoleRepository.js';

export default async function seedRoles() {
    
    const existing = await roleRepository.getAll();
    if (existing.length === 0) {
        await roleRepository.create({ name: 'user' });
        await roleRepository.create({ name: 'admin' });
        console.log('Seeded roles: user, admin');
    }
}



