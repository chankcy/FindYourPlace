import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export const getHotels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, maxPrice, location } = req.query;

    const filters: any = {};
    if (category) filters.category = String(category);
    if (maxPrice) filters.pricePerNight = { lte: parseFloat(String(maxPrice)) };
    if (location) filters.location = { contains: String(location), mode: 'insensitive' };

    const hotels = await prisma.hotel.findMany({ where: filters });
    res.status(200).json({ success: true, count: hotels.length, data: hotels });
  } catch (error) {
    next(error);
  }
};

export const createHotel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, location, pricePerNight, capacity, category, description, imageUrl } = req.body;

    if (!name || !location || !pricePerNight || !capacity || !category) {
      return next(new AppError('Please provide all required hotel fields.', 400));
    }

    const hotel = await prisma.hotel.create({
      data: {
        name,
        location,
        pricePerNight: parseFloat(pricePerNight),
        capacity: parseInt(capacity),
        category,
        description,
        imageUrl,
      },
    });

    res.status(201).json({ success: true, data: hotel });
  } catch (error) {
    next(error);
  }
};