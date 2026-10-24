import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { register, login, currentUser, logout } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validation/schemas.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many attempts. Please try again later.' } } });

router.post('/register', authLimiter, validate(registerSchema), asyncHandler(register));
router.post('/login', authLimiter, validate(loginSchema), asyncHandler(login));
router.get('/me', requireAuth, currentUser);
router.post('/logout', logout);

export default router;

