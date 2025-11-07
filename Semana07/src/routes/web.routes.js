import { Router } from 'express';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';
import userRepository from '../repositories/UserRepository.js';

const router = Router();

// Página de inicio -> SignIn
router.get('/', (req, res) => res.render('signin'));

// Rutas explícitas de vistas
router.get('/signIn', (req, res) => res.render('signin'));
router.get('/signUp', (req, res) => res.render('signup'));

router.get('/dashboard', authenticate, async (req, res) => {
  const user = await userRepository.findById(req.userId); 
  if (!user) return res.redirect('/403');

  const roles = (user.roles || []).map(r => r.name);
  if (roles.includes('admin')) {
    res.render('dashboard_admin', { users: [] }); 
  } else if (roles.includes('user')) {
    res.render('dashboard_user', { user });      
  } else {
    res.redirect('/403');
  }
});

// Vista de detalle de usuario (solo admin)
router.get('/users/:id', authenticate, authorize(['admin']), (req, res) => {
  res.render('user_detail');
});

// Perfil del usuario autenticado
router.get('/profile', authenticate, async (req, res) => {
  const me = await userRepository.findById(req.userId);
  res.render('profile', { user: me });
});

// Vista para editar el perfil
router.get('/profile/edit', authenticate, (req, res) => res.render('profile_edit'));

// Páginas de error
router.get('/403', (req, res) => res.status(200).render('403'));
router.get('*', (req, res) => res.status(404).render('404'));

export default router;
