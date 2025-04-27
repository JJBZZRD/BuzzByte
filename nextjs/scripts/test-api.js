// Script to test the login API endpoint
// Using dynamic import for newer versions of node-fetch
async function testLoginApi(username, password) {
  try {
    // Dynamic import
    const { default: fetch } = await import('node-fetch');
    
    console.log(`Testing login API with username: ${username}, password: ${password}`);
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const status = response.status;
    const data = await response.json();
    
    console.log('Response status:', status);
    console.log('Response data:', data);
    
    return { status, data };
  } catch (error) {
    console.error('Error testing login API:', error);
    return { error: error.message };
  }
}

// Test with the provided credentials
const testUsername = process.argv[2] || 'admin';
const testPassword = process.argv[3] || 'mynewpassword';

// Run the test
(async () => {
  try {
    await testLoginApi(testUsername, testPassword);
    console.log('\nAPI test completed');
  } catch (error) {
    console.error('Unhandled error:', error);
  }
})(); 