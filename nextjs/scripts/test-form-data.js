// Test script for form data handling
// Run with: node scripts/test-form-data.js

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

const BASE_URL = 'http://localhost:3000';

// Sample project data for testing
const sampleProject = {
  title: "Test Project",
  slug: "test-project",
  description: "A test project created from the test script",
  longDescription: "This is a longer description of the test project that was created using a test script.",
  role: "Test Engineer",
  imageGradient: "from-blue-600/20 to-purple-600/20",
  videoEmbed: "",
  tags: "test, automation, script",
  highlights: ["First test highlight", "Second test highlight"],
  links: [
    { type: "GitHub", url: "https://github.com/example/test-project" },
    { type: "Demo", url: "https://example.com/demo" }
  ],
  technologies: [
    { name: "JavaScript", description: "Used for scripting tests" },
    { name: "Node.js", description: "Used for running the test automation" }
  ],
  challenges: [
    { title: "Test Challenge", description: "Overcoming the challenge of testing complex form submissions" }
  ],
  outcomes: ["Successfully tested form data handling", "Verified image upload functionality"]
};

// Function to test form data submission
async function testFormDataSubmission() {
  console.log('🔍 Testing form data submission...\n');
  
  try {
    // Create a FormData instance for multipart/form-data
    const formData = new FormData();
    
    // Add the JSON data
    formData.append('data', JSON.stringify(sampleProject));
    
    // Check if we have test images to add
    const testImagesDir = path.join(__dirname, 'test-images');
    let foundImages = false;
    
    if (fs.existsSync(testImagesDir)) {
      const files = fs.readdirSync(testImagesDir)
        .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
      
      if (files.length > 0) {
        foundImages = true;
        console.log(`Found ${files.length} test images to include in form data`);
        
        // Add each test image to the form data
        files.forEach((file, index) => {
          const filePath = path.join(testImagesDir, file);
          const tempId = `temp-${Date.now()}-${index}`;
          formData.append(`file_${tempId}`, fs.createReadStream(filePath));
          console.log(`Added ${file} as file_${tempId}`);
        });
      }
    }
    
    if (!foundImages) {
      console.log('No test images found in scripts/test-images directory');
    }
    
    // Simulate form submission
    console.log('\nSimulating form data submission...');
    console.log('POST /api/projects');
    
    // This is a dry run - we won't actually submit to avoid creating test data in your DB
    console.log('\n✅ Form data prepared successfully!');
    console.log('⚠️ This is a dry run - no actual API call made');
    
    // If you want to actually submit the form, uncomment the following code:
    /*
    const response = await fetch(`${BASE_URL}/api/projects`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to submit form: ${errorData.error || response.statusText}`);
    }
    
    const result = await response.json();
    console.log('✅ Form submitted successfully!');
    console.log(`Project created with ID: ${result.id}`);
    */
    
    // Test temporary files map
    console.log('\n🔍 Testing temporary files map functionality...');
    
    // Create a Map to simulate the tempImageFiles map
    const tempFiles = new Map();
    
    if (foundImages) {
      const files = fs.readdirSync(testImagesDir)
        .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
      
      files.forEach((file, index) => {
        const filePath = path.join(testImagesDir, file);
        const tempId = `temp-${Date.now()}-${index}`;
        const fileBuffer = fs.readFileSync(filePath);
        
        // Create a File-like object for testing
        const fileObj = {
          name: file,
          size: fileBuffer.length,
          type: `image/${path.extname(file).substring(1)}`,
          buffer: fileBuffer
        };
        
        tempFiles.set(tempId, fileObj);
      });
      
      console.log(`✅ Successfully added ${tempFiles.size} files to temporary files map`);
      
      // Test serializing the map for FormData
      console.log('\nTesting map serialization for FormData:');
      tempFiles.forEach((file, id) => {
        console.log(`- ${id}: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
      });
    }
    
    console.log('\n✨ All form data tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing form data:', error.message);
  }
}

// Run the tests
testFormDataSubmission(); 