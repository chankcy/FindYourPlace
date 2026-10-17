import { Router, Request, Response, NextFunction } from 'express';
import { createBooking, getUserBookings } from '../controllers/bookingController';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, (req: Request, res: Response, next: NextFunction) => {
  createBooking(req as AuthRequest, res, next);
});

router.get('/user', authenticateToken, (req: Request, res: Response, next: NextFunction) => {
  getUserBookings(req as AuthRequest, res, next);
});

export default router;