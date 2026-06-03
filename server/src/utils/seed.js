import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Property from '../models/Property.js';

dotenv.config();

const seedUsers = [
  {
    name: 'Demo Host',
    email: 'host@demo.com',
    password: 'Demo1234!',
    role: 'host',
  },
  {
    name: 'Demo Guest',
    email: 'guest@demo.com',
    password: 'Demo1234!',
    role: 'guest',
  },
];

const sampleProperties = [
  {
    title: 'Cozy Studio in Paris',
    description:
      'Bright studio apartment in the heart of Paris, walking distance to cafés and the metro. Perfect for couples exploring the city.',
    price: 89,
    location: { address: '12 Rue de Rivoli', city: 'Paris', country: 'France' },
    amenities: ['wifi', 'kitchen', 'heating'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    ],
    propertyType: 'apartment',
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    title: 'Modern Loft in Brooklyn',
    description:
      'Spacious loft with skyline views, open kitchen, and fast WiFi. Ideal for remote workers and small groups.',
    price: 145,
    location: { address: '45 Bedford Ave', city: 'New York', country: 'USA' },
    amenities: ['wifi', 'workspace', 'washer', 'air conditioning'],
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    ],
    propertyType: 'apartment',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
  },
  {
    title: 'Beach Villa in Bali',
    description:
      'Private villa steps from the beach with pool access and tropical garden. Relax and unwind in paradise.',
    price: 220,
    location: { city: 'Ubud', country: 'Indonesia', address: 'Jalan Raya Ubud' },
    amenities: ['wifi', 'pool', 'parking', 'kitchen', 'breakfast'],
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
    ],
    propertyType: 'villa',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
  },
  {
    title: 'Mountain Cabin in Aspen',
    description:
      'Rustic cabin with fireplace and mountain views. Great for ski season or summer hiking getaways.',
    price: 175,
    location: { city: 'Aspen', country: 'USA', address: 'Snowmass Rd' },
    amenities: ['wifi', 'fireplace', 'parking', 'kitchen'],
    images: ['https://images.unsplash.com/photo-1518780669617-1e752b83b9f8?w=800'],
    propertyType: 'cabin',
    maxGuests: 5,
    bedrooms: 2,
    bathrooms: 1,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({ email: { $in: seedUsers.map((u) => u.email) } });
    await Property.deleteMany({});

    const users = [];
    for (const userData of seedUsers) {
      const user = await User.create(userData);
      users.push(user);
      console.log(`Created user: ${userData.email} (${userData.role})`);
    }

    const host = users.find((u) => u.role === 'host');
    for (const prop of sampleProperties) {
      await Property.create({ ...prop, host: host._id });
      console.log(`Created property: ${prop.title}`);
    }

    console.log('\nSeed complete.');
    console.log('  Host:  host@demo.com / Demo1234!');
    console.log('  Guest: guest@demo.com / Demo1234!');
    console.log(`  Properties: ${sampleProperties.length} listings`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
