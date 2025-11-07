import { Router } from 'express';
import authController from '../controllers/AuthController.js';

const router = Router();

router.post('/signUp', authController.signUp);
router.post('/signIn', authController.signIn);
router.post('/logout', authController.logout);  

export default router;
