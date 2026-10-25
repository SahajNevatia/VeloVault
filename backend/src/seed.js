require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/velovault');
    console.log('Connected to MongoDB for seeding...');

    // Clean existing data
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    console.log('Cleared existing collections.');

    // Seed users
    const admin = await User.create({
      username: 'admin',
      email: 'admin@velovault.com',
      password: 'admin123',
      role: 'admin',
    });

    const user = await User.create({
      username: 'customer',
      email: 'customer@velovault.com',
      password: 'password123',
      role: 'user',
    });

    console.log('Created users:');
    console.log(` - Admin: admin@velovault.com / admin123`);
    console.log(` - User:  customer@velovault.com / password123`);

    // Seed vehicles
    const vehicles = [
      {
        make: 'Tesla',
        model: 'Model 3 Performance',
        year: 2024,
        category: 'sedan',
        price: 52990,
        quantity: 6,
        description: 'Dual Motor All-Wheel Drive with blistering 0-60 in 2.9s and premium black interior.',
        imageUrl: '/images/cars/tesla.png',
      },
      {
        make: 'Porsche',
        model: '911 Carrera',
        year: 2023,
        category: 'coupe',
        price: 114400,
        quantity: 2,
        description: 'Twin-turbo flat-six engine delivering iconic performance and unmatched German engineering.',
        imageUrl: '/images/cars/porsche.png',
      },
      {
        make: 'Ford',
        model: 'F-150 Lightning',
        year: 2024,
        category: 'truck',
        price: 54995,
        quantity: 5,
        description: 'All-electric pickup truck with 775 lb-ft of torque and onboard generator power.',
        imageUrl: '/images/cars/ford.jpg',
      },
      {
        make: 'Toyota',
        model: 'RAV4 Hybrid',
        year: 2024,
        category: 'suv',
        price: 34350,
        quantity: 8,
        description: 'Best-selling compact SUV combining exceptional fuel economy with versatile cargo capacity.',
        imageUrl: '/images/cars/toyota.png',
      },
      {
        make: 'BMW',
        model: 'M4 Competition',
        year: 2023,
        category: 'coupe',
        price: 78600,
        quantity: 3,
        description: '503 hp M TwinPower Turbo inline 6-cylinder powerhouse with carbon fiber roof.',
        imageUrl: '/images/cars/bmw.jpg',
      },
      {
        make: 'Honda',
        model: 'Civic Type R',
        year: 2024,
        category: 'hatchback',
        price: 44795,
        quantity: 4,
        description: 'Track-ready hot hatch with 315-hp turbocharged 2.0-liter VTEC engine.',
        imageUrl: '/images/cars/honda.png',
      },
      {
        make: 'Audi',
        model: 'RS6 Avant',
        year: 2024,
        category: 'wagon',
        price: 125800,
        quantity: 1,
        description: 'Twin-turbo V8 superwagon producing 591 hp with legendary Quattro AWD.',
        imageUrl: '/images/cars/audi.png',
      },
      {
        make: 'Mazda',
        model: 'MX-5 Miata',
        year: 2024,
        category: 'convertible',
        price: 28985,
        quantity: 0,
        description: 'Pure roadster thrills with near 50/50 weight distribution (Currently out of stock).',
        imageUrl: '/images/cars/mazda.png',
      },
    ];

    await Vehicle.insertMany(vehicles);
    console.log(`Seeded ${vehicles.length} sample vehicles successfully.`);

    await mongoose.disconnect();
    console.log('Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
