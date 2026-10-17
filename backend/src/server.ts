import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { prisma } from './lib/prisma';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to the PostgreSQL database via Prisma.');

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${5432}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();