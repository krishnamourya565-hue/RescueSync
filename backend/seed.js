const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Task = require('./src/models/Task');
const Resource = require('./src/models/Resource');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing
    await User.deleteMany();
    await Task.deleteMany();
    await Resource.deleteMany();

    // Create users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      name: 'Admin Government',
      email: 'admin@rescuesync.gov',
      password: hashedPassword,
      role: 'Admin',
      location: 'City HQ'
    });

    const ngo = await User.create({
      name: 'Red Cross Relief',
      email: 'ngo@redcross.org',
      password: hashedPassword,
      role: 'NGO',
      location: 'North District'
    });

    const volunteer = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'Volunteer',
      skills: ['Medical', 'Driving'],
      location: 'East District'
    });

    console.log('Users created');

    // Create tasks
    await Task.create({
      title: 'Deliver Food Supplies to North District',
      description: 'Need urgent delivery of 100 food packets to the North District shelter.',
      location: { lat: 40.7306, lng: -73.9352, address: 'North District Shelter' },
      status: 'Pending',
      createdBy: admin._id
    });

    await Task.create({
      title: 'Medical Assistance Required',
      description: 'Minor injuries reported in East District. Need volunteers with medical training.',
      location: { lat: 40.7128, lng: -74.0060, address: 'East District Main Square' },
      status: 'In Progress',
      assignedTo: volunteer._id,
      createdBy: ngo._id
    });

    console.log('Tasks created');

    // Create resources
    await Resource.create({
      type: 'Food',
      quantity: 500,
      unit: 'packets',
      location: 'Central Warehouse',
      addedBy: admin._id
    });

    await Resource.create({
      type: 'Water',
      quantity: 1000,
      unit: 'liters',
      location: 'Central Warehouse',
      addedBy: admin._id
    });

    console.log('Resources created');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
