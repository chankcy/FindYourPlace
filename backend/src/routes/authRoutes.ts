import { Router, Request, Response } from 'express';
import { Role } from '@prisma/client';
import { register, login } from '../controllers/authController';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected profile route
router.get('/me', authenticateToken, (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  res.status(200).json({
    success: true,
    data: { user: authReq.user },
  });
});

// Admin-restricted route
router.get('/admin-dashboard', authenticateToken, authorizeRoles(Role.ADMIN), (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Admin Dashboard.',
  });
});

export default router;