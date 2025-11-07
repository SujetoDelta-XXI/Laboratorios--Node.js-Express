import Role from '../models/Role.js';

class RoleRepository {

    async findByName(name) {
        return Role.findOne({ name }).exec();
    }

    async create(role) {
        return Role.create(role);
    }

    async getAll() {
        return Role.find().exec();
    }
}

export default new RoleRepository();
