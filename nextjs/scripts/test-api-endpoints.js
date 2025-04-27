// Test script for API endpoints
// Run with: node scripts/test-api-endpoints.js

const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

// Test endpoints
async function testEndpoints() {
  console.log('🔍 Testing API endpoints...\n');
  
  try {
    // 1. Test projects GET endpoint
    console.log('Testing GET /api/projects');
    const projectsResponse = await fetch(`${BASE_URL}/api/projects`);
    
    if (!projectsResponse.ok) {
      throw new Error(`Failed to fetch projects: ${projectsResponse.status} ${projectsResponse.statusText}`);
    }
    
    const projects = await projectsResponse.json();
    console.log(`✅ Successfully fetched ${projects.length} projects\n`);
    
    // 2. Test tags endpoint
    console.log('Testing GET /api/tags');
    const tagsResponse = await fetch(`${BASE_URL}/api/tags`);
    
    if (!tagsResponse.ok) {
      throw new Error(`Failed to fetch tags: ${tagsResponse.status} ${tagsResponse.statusText}`);
    }
    
    const tags = await tagsResponse.json();
    console.log(`✅ Successfully fetched ${tags.length} tags\n`);
    
    // 3. Test technologies endpoint
    console.log('Testing GET /api/technologies');
    const techResponse = await fetch(`${BASE_URL}/api/technologies`);
    
    if (!techResponse.ok) {
      throw new Error(`Failed to fetch technologies: ${techResponse.status} ${techResponse.statusText}`);
    }
    
    const technologies = await techResponse.json();
    console.log(`✅ Successfully fetched ${technologies.length} technologies\n`);
    
    // 4. Test image upload endpoint (if test image exists)
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    
    if (fs.existsSync(testImagePath)) {
      console.log('Testing POST /api/upload/carousel');
      
      const form = new FormData();
      form.append('file', fs.createReadStream(testImagePath));
      form.append('projectId', '999'); // Test project ID
      form.append('description', 'Test image description');
      
      const uploadResponse = await fetch(`${BASE_URL}/api/upload/carousel`, {
        method: 'POST',
        body: form
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload image: ${uploadResponse.status} ${uploadResponse.statusText}`);
      }
      
      const uploadResult = await uploadResponse.json();
      console.log('✅ Successfully tested image upload endpoint');
      console.log(`   Image URL: ${uploadResult.url}\n`);
    } else {
      console.log('ℹ️ Skipping image upload test (no test image found at scripts/test-image.jpg)\n');
    }
    
    console.log('✨ All API endpoints tested successfully!');
    
  } catch (error) {
    console.error('❌ Error testing endpoints:', error.message);
  }
}

// Run the tests
testEndpoints(); 