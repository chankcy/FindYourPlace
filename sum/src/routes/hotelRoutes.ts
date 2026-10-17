import { Router } from 'express';
import { Role } from '@prisma/client';
import { getHotels, createHotel } from '../controllers/hotelController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/', getHotels);
router.post('/', authenticateToken, authorizeRoles(Role.ADMIN), createHotel);

export default router;