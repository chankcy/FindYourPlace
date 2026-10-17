import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const defaultProperties = [
  { name: "Cozy Oceanview Villa", location: "Malibu, California", pricePerNight: 250, capacity: 4, category: "beach", imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", description: "Stunning ocean views with modern interior, private balcony, and direct beach access." },
  { name: "Alpine Timber Chalet", location: "Aspen, Colorado", pricePerNight: 380, capacity: 6, category: "mountain", imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80", description: "Luxurious wooden lodge close to ski slopes with a heated outdoor hot tub." },
  { name: "Modern Downtown Loft", location: "New York, USA", pricePerNight: 195, capacity: 2, category: "city", imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80", description: "High-rise luxury apartment in the heart of Manhattan with spectacular skyline views." },
  { name: "Serene Garden Cottage", location: "Kyoto, Japan", pricePerNight: 160, capacity: 3, category: "budget", imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80", description: "Traditional Japanese garden home with tatami rooms and peaceful surroundings." },
  { name: "Mediterranean Beach Pad", location: "Santorini, Greece", pricePerNight: 310, capacity: 5, category: "beach", imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80", description: "Whitewashed villa overlooking the Aegean Sea with private infinity pool." },
  { name: "Swiss Alps Horizon Cabin", location: "Zermatt, Switzerland", pricePerNight: 420, capacity: 4, category: "mountain", imageUrl: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80", description: "Unmatched views of the Matterhorn with private sauna and fireplace." },
  { name: "Tokyo Shinjuku Sky Suite", location: "Tokyo, Japan", pricePerNight: 220, capacity: 2, category: "city", imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80", description: "Ultra-modern sky suite steps from neon lights and world-class dining." },
  { name: "Bali Bamboo Eco Sanctuary", location: "Ubud, Indonesia", pricePerNight: 130, capacity: 2, category: "budget", imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80", description: "Open-air handcrafted bamboo villa immersed in lush jungle landscapes." }
];

async function main() {
  console.log('Seeding database...');

  // 1. Create Default Test User
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'guest@fyp.com' },
    update: {},
    create: {
      name: 'Guest User',
      email: 'guest@fyp.com',
      password: hashedPassword,
      role: Role.USER,
    },
  });
  console.log(`Created user: ${user.email}`);

  // 2. Create Default Hotels
  for (const property of defaultProperties) {
    await prisma.hotel.create({
      data: property,
    });
  }

  console.log(`Successfully seeded ${defaultProperties.length} hotels!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });