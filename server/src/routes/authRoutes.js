import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from '../validators/authSchemas.js';
import {
  register,
  login,
  getMe,
  updateMe,
  logout,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);
router.put('/me', protect, validate(updateProfileSchema), updateMe);
router.post('/logout', protect, logout);

// Role check — useful when testing Postman (host only)
router.get(
  '/host-check',
  protect,
  authorize('host'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Host access granted',
      data: { user: req.user },
    });
  }
);

export default router;
