import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { sendEnquiryConfirmation } from '../utils/email';

export const createEnquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!email || !message) {
      return next(new AppError('Please provide email and message.', 400));
    }

    // 1. Store enquiry in database (passing only schema-matching fields)
    const enquiry = await prisma.enquiry.create({
      data: {
        email,
        subject: subject || 'General Enquiry',
        message,
      },
    });

    // 2. Trigger automatic email reply
    sendEnquiryConfirmation(email, name || 'Valued Guest', message).catch((err) => {
      console.error('Failed to send enquiry confirmation email:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully. A confirmation email has been sent.',
      data: enquiry,
    });
  } catch (error) {
    next(error);
  }
};