import { Router } from 'express';
import {
  getAlternativesByProduct,
  getAlternativesByCategory,
  getTopAlternatives,
  getRecentAlternatives,
  createAlternative,
  deleteAlternative,
} from './alternative.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { validateRequest } from '../../middleware/validate.js';
import { createAlternativeSchema } from './alternative.validation.js';

const router = Router();

// Public routes
router.get('/product/:productId', getAlternativesByProduct);
router.get('/category/:categoryId', getAlternativesByCategory);
router.get('/top', getTopAlternatives);
router.get('/recent', getRecentAlternatives);

// Protected routes
router.post('/', authenticate, requireRole('MODERATOR', 'ADMIN'), validateRequest(createAlternativeSchema), createAlternative);
router.delete('/:id', authenticate, requireRole('MODERATOR', 'ADMIN'), deleteAlternative);

export default router;

