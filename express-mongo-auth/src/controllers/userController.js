import { userService } from '../services/userService.js';

export const userController = {
  async getAll(req, res) {
    const users = await userService.getAll();
    res.json(users);
  },
  async getById(req, res) {
    const user = await userService.getById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  },
  async create(req, res) {
    const newUser = await userService.create(req.body);
    res.status(201).json(newUser);
  },
  async update(req, res) {
    const updated = await userService.update(req.params.id, req.body);
    res.json(updated);
  },
  async remove(req, res) {
    await userService.remove(req.params.id);
    res.status(204).end();
  }
};

