import express from 'express';
import UserController from '../controllers/UserController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';
import userRepository from '../repositories/UserRepository.js';

const router = express.Router();

// ✅ Obtener TODOS los usuarios (solo admin)
router.get('/', authenticate, authorize(['admin']), UserController.getAll);

// ✅ Obtener el usuario autenticado
router.get('/me', authenticate, authorize([]), UserController.getMe);

// ✅ Actualizar datos personales (solo el dueño)
router.put('/me', authenticate, async (req, res, next) => {
  try {
    const { name, lastName, phoneNumber, adress, url_profile } = req.body;
    const user = await userRepository.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    user.name = name ?? user.name;
    user.lastName = lastName ?? user.lastName;
    user.phoneNumber = phoneNumber ?? user.phoneNumber;
    user.adress = adress ?? user.adress;
    user.url_profile = url_profile ?? user.url_profile;

    await user.save();
    res.json({ message: 'Datos actualizados correctamente' });
  } catch (err) {
    next(err);
  }
});

// 🆕 Obtener usuario por ID (solo admin)
router.get('/:id', authenticate, authorize(['admin']), UserController.getById);

export default router;
