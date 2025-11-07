import { userRepository } from '../repositories/userRepository.js';

export const userService = {
  getAll: () => userRepository.getAll(),
  getById: (id) => userRepository.getById(id),
  create: (data) => userRepository.create(data),
  update: (id, data) => userRepository.update(id, data),
  remove: (id) => userRepository.remove(id)
};
