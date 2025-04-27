// Script to generate a hashed password for admin user
const bcrypt = require('bcrypt');

// Get the password from command line arguments or use a default test password
const password = process.argv[2] || 'admin123';
const saltRounds = 10;

async function hashPassword() {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('\nHashed password generated successfully:');
    console.log('----------------------------------------');
    console.log(hash);
    console.log('----------------------------------------\n');
    
    console.log('Add these lines to your .env.local file:');
    console.log('ADMIN_USERNAME=admin');
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log('JWT_SECRET=your_secure_random_string_here');
    
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

hashPassword(); 