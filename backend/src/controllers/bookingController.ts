import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { sendBookingConfirmation } from '../utils/email';

export const createBooking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const { hotelId, checkIn, checkOut, totalPrice } = req.body;

    if (!userId) {
      return next(new AppError('User authentication required.', 401));
    }

    if (!hotelId || !checkIn || !checkOut || !totalPrice) {
      return next(new AppError('Missing required booking parameters.', 400));
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return next(new AppError('Invalid date format provided.', 400));
    }

    if (checkInDate >= checkOutDate) {
      return next(new AppError('Check-out date must be after check-in date.', 400));
    }

    const hotelExists = await prisma.hotel.findUnique({ where: { id: hotelId } });
    if (!hotelExists) {
      return next(new AppError('Hotel property not found.', 404));
    }

    // Check for conflicting confirmed bookings
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        hotelId,
        status: 'CONFIRMED',
        AND: [
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } },
        ],
      },
    });

    if (conflictingBooking) {
      return next(new AppError('This property is already booked for the selected dates.', 409));
    }

    // Create reservation and include user + hotel relations for the confirmation email
    const booking = await prisma.booking.create({
      data: {
        userId,
        hotelId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice: parseFloat(String(totalPrice)),
        status: 'CONFIRMED',
      },
      include: {
        hotel: true,
        user: true,
      },
    });

    // Secondary Nodemailer service: Trigger booking confirmation email
    sendBookingConfirmation(
      booking.user.email,
      booking.user.name,
      booking.hotel.name,
      booking.checkIn,
      booking.checkOut,
      booking.totalPrice
    ).catch((err) => {
      console.error('Failed to send booking confirmation email:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Reservation successfully created. A confirmation email has been sent.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserBookings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return next(new AppError('User authentication required.', 401));
    }

    const userBookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            location: true,
            imageUrl: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      count: userBookings.length,
      data: userBookings,
    });
  } catch (error) {
    next(error);
  }
};