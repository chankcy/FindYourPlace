import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import hotelRoutes from './routes/hotelRoutes';
import bookingRoutes from './routes/bookingRoutes';
import enquiryRoutes from './routes/enquiryRoutes';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', hotelRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/enquiries', enquiryRoutes);

// Healthcheck
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Centralized error handling
app.use(errorHandler);

export default app;