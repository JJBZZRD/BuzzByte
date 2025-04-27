// Script to check environment variables
require('dotenv').config({ path: '.env.local' });

console.log('\nChecking environment variables for admin authentication:');
console.log('---------------------------------------------------');
console.log('ADMIN_USERNAME:', process.env.ADMIN_USERNAME || 'Not set');
console.log('ADMIN_PASSWORD_HASH length:', process.env.ADMIN_PASSWORD_HASH ? process.env.ADMIN_PASSWORD_HASH.length : 'Not set');
console.log('JWT_SECRET set:', !!process.env.JWT_SECRET);
console.log('---------------------------------------------------\n');

// Just print the first few characters of the hash to confirm it's loading correctly
// without exposing the entire hash
if (process.env.ADMIN_PASSWORD_HASH) {
  console.log('First 10 characters of hash:', process.env.ADMIN_PASSWORD_HASH.substring(0, 10));
} 