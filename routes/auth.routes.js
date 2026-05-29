import express from 'express';
import authController from '../controllers/auth.controller.js';
import { registerSchema, loginSchema,forgotPasswordSchema, resetPasswordSchema, validateData } from '../validation/userValidation.js';
import authMiddleware from '../middlewares/authMiddlewares.js';
import { verifyOTP } from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/register',validateData(registerSchema), authController.register);
router.post('/login', validateData(loginSchema),authController.login);
router.get('/me',authMiddleware, authController.getMe);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password',validateData(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password',validateData(resetPasswordSchema), authController.resetPassword);
router.put('/change-password', authMiddleware, authController.changePassword);
router.post('/resend-otp', authController.resendOtp);
export default router;