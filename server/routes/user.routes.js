import { Router } from 'express';
import { body } from 'express-validator';
import { getProfile, updateProfile } from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = Router();

router.get('/profile', auth, getProfile);
router.put(
  '/profile',
  auth,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
  ],
  validate,
  updateProfile
);

export default router;
