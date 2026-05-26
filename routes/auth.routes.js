import express from 'express';
import authController from '../controllers/auth.controller.js';
import { registerSchema, loginSchema, validateData } from '../validation/userValidation.js';
import authMiddleware from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/register',validateData(registerSchema), authController.register);
router.post('/login', validateData(loginSchema),authController.login);
router.get('/me',authMiddleware, authController.getMe);

export default router;