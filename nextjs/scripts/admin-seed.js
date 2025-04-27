const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function seedAdmin() {
  console.log('Creating admin user in database...');
  
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.argv[2] || 'password123'; // Default, should be overridden when running script
  
  if (!password) {
    console.error('No password provided. Please provide a password as an argument.');
    process.exit(1);
  }
  
  // Hash password with bcrypt
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  
  try {
    // Delete any existing admin with this username
    await prisma.admin.deleteMany({
      where: { username }
    });
    
    // Create new admin user
    const admin = await prisma.admin.create({
      data: {
        username,
        passwordHash,
        role: 'admin',
      }
    });
    
    console.log(`Admin user created: ${admin.username}`);
    console.log('-----------------------------------------------');
    console.log('Username:', admin.username);
    console.log('Password: [HIDDEN - what you provided]');
    console.log('-----------------------------------------------');
    console.log('You can now log in with these credentials.');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin()
  .catch(error => {
    console.error('Uncaught error:', error);
    process.exit(1);
  }); 