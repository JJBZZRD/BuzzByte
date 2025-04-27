// Script to test password verification with bcrypt
require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcrypt');

async function testLogin(password) {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  
  console.log('Testing with hash:', hash);
  
  if (!hash) {
    console.error('ADMIN_PASSWORD_HASH not found in environment variables');
    return false;
  }
  
  try {
    console.log(`Comparing password "${password}" with bcrypt`);
    const result = await bcrypt.compare(password, hash);
    console.log('Bcrypt comparison result:', result);
    return result;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
}

// Test with the provided password
const testPassword = process.argv[2] || 'mynewpassword';
console.log(`\nTesting login with password: ${testPassword}`);

// Immediate console logs for debugging
console.log('Environment variables:');
console.log('- ADMIN_USERNAME:', process.env.ADMIN_USERNAME);
console.log('- ADMIN_PASSWORD_HASH exists:', !!process.env.ADMIN_PASSWORD_HASH);
console.log('- ADMIN_PASSWORD_HASH length:', process.env.ADMIN_PASSWORD_HASH ? process.env.ADMIN_PASSWORD_HASH.length : 0);

// Run the test
(async () => {
  try {
    const isValid = await testLogin(testPassword);
    console.log(`\nPassword "${testPassword}" is ${isValid ? 'VALID' : 'INVALID'}`);
  } catch (err) {
    console.error('Unhandled error in test:', err);
  }
})(); 