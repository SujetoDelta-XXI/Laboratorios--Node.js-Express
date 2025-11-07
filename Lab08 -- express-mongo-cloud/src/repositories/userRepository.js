import User from '../models/User.js';

export const userRepository = {
  async getAll() {
    return User.find();
  },
  async getById(id) {
    return User.findById(id);
  },
  async create(data) {
    return User.create(data);
  },
  async update(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true });
  },
  async remove(id) {
    return User.findByIdAndDelete(id);
  }
};

