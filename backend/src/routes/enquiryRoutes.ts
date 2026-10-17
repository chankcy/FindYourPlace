import { Router } from 'express';
import { createEnquiry } from '../controllers/enquiryController';

const router = Router();

// POST /api/enquiries
router.post('/', createEnquiry);

export default router;