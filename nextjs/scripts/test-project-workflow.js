// Test script for full project workflow
// Run with: node scripts/test-project-workflow.js

const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const BASE_URL = 'http://localhost:3000';

// Generate a unique test project
const testProject = {
  title: `Test Project ${Date.now()}`,
  slug: `test-project-${Date.now()}`,
  description: "Automatically generated test project",
  longDescription: "This project was created by the test-project-workflow.js script to verify the project creation and editing flow.",
  role: "Test Engineer",
  imageGradient: "from-blue-600/20 to-purple-600/20",
  videoEmbed: "",
  tags: "test, automation",
  highlights: ["Created by test script", "Verifies project workflow"],
  links: [
    { type: "Test Link", url: "https://example.com/test" }
  ],
  technologies: [
    { name: "JavaScript", description: "Used for testing" }
  ],
  challenges: [
    { title: "Test Challenge", description: "Overcoming the challenges of automated testing" }
  ],
  outcomes: ["Verified project workflow functionality"]
};

// Test the entire project workflow
async function testProjectWorkflow() {
  console.log('🔍 Testing full project workflow...\n');
  
  try {
    let projectId;
    
    // Step 1: Create a new project
    console.log('1️⃣ Testing project creation');
    
    // Prepare form data for project creation
    const createFormData = new FormData();
    createFormData.append('data', JSON.stringify(testProject));
    
    // Add test image if available
    const testImageDir = path.join(__dirname, 'test-images');
    if (fs.existsSync(testImageDir)) {
      const imageFiles = fs.readdirSync(testImageDir)
        .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
      
      if (imageFiles.length > 0) {
        const imagePath = path.join(testImageDir, imageFiles[0]);
        const tempId = `temp-${Date.now()}`;
        createFormData.append(`file_${tempId}`, fs.createReadStream(imagePath));
        console.log(`Added test image: ${imageFiles[0]} as file_${tempId}`);
      }
    }
    
    console.log('Creating project (dry run)...');
    console.log(`POST ${BASE_URL}/api/projects`);
    console.log('Project data:', testProject);
    
    // This is a dry run - comment out this and uncomment the fetch block below to actually run
    projectId = 999; // Fake project ID for testing
    console.log('⚠️ This is a dry run - no actual API call made');
    console.log(`Simulated project created with ID: ${projectId}\n`);
    
    /*
    // Uncomment to actually create a project
    const createResponse = await fetch(`${BASE_URL}/api/projects`, {
      method: 'POST',
      body: createFormData
    });
    
    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      throw new Error(`Failed to create project: ${errorData.error || createResponse.statusText}`);
    }
    
    const createResult = await createResponse.json();
    projectId = createResult.id;
    console.log(`✅ Project created with ID: ${projectId}\n`);
    */
    
    // Step 2: Fetch the created project
    console.log(`2️⃣ Testing project retrieval`);
    console.log(`GET ${BASE_URL}/api/projects/${projectId}`);
    
    // This is a dry run
    console.log('⚠️ This is a dry run - no actual API call made');
    const fetchedProject = { ...testProject, id: projectId };
    console.log(`Simulated fetching project with ID: ${projectId}\n`);
    
    /*
    // Uncomment to actually fetch the project
    const fetchResponse = await fetch(`${BASE_URL}/api/projects/${projectId}`);
    
    if (!fetchResponse.ok) {
      const errorData = await fetchResponse.json();
      throw new Error(`Failed to fetch project: ${errorData.error || fetchResponse.statusText}`);
    }
    
    const fetchedProject = await fetchResponse.json();
    console.log(`✅ Successfully fetched project with ID: ${projectId}\n`);
    */
    
    // Step 3: Update the project
    console.log(`3️⃣ Testing project update`);
    
    // Prepare updated project data
    const updatedProject = {
      ...fetchedProject,
      title: `${fetchedProject.title} (Updated)`,
      description: `${fetchedProject.description} - Updated by test script`,
      // Add more changes as needed
    };
    
    // Prepare form data for update
    const updateFormData = new FormData();
    updateFormData.append('data', JSON.stringify(updatedProject));
    
    // Add another test image if available
    if (fs.existsSync(testImageDir)) {
      const imageFiles = fs.readdirSync(testImageDir)
        .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
      
      if (imageFiles.length > 1) {
        const imagePath = path.join(testImageDir, imageFiles[1]);
        const tempId = `temp-${Date.now()}`;
        updateFormData.append(`file_${tempId}`, fs.createReadStream(imagePath));
        console.log(`Added another test image: ${imageFiles[1]} as file_${tempId}`);
      }
    }
    
    console.log('Updating project (dry run)...');
    console.log(`PUT ${BASE_URL}/api/projects/${projectId}`);
    console.log('Updated project data:', {
      title: updatedProject.title,
      description: updatedProject.description
      // Don't log the entire object for brevity
    });
    
    // This is a dry run
    console.log('⚠️ This is a dry run - no actual API call made');
    console.log(`Simulated updating project with ID: ${projectId}\n`);
    
    /*
    // Uncomment to actually update the project
    const updateResponse = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
      method: 'PUT',
      body: updateFormData
    });
    
    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(`Failed to update project: ${errorData.error || updateResponse.statusText}`);
    }
    
    console.log(`✅ Successfully updated project with ID: ${projectId}\n`);
    */
    
    // Step 4: Test image carousel upload
    console.log(`4️⃣ Testing image carousel upload`);
    
    // This is a dry run
    console.log('⚠️ This is a dry run - no actual API call made');
    console.log(`Simulated uploading images to project carousel\n`);
    
    /*
    // Uncomment to actually test carousel image upload
    if (fs.existsSync(testImageDir)) {
      const imageFiles = fs.readdirSync(testImageDir)
        .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
      
      if (imageFiles.length > 0) {
        const imagePath = path.join(testImageDir, imageFiles[0]);
        
        // Create form data
        const imageFormData = new FormData();
        imageFormData.append('file', fs.createReadStream(imagePath));
        imageFormData.append('projectId', projectId.toString());
        imageFormData.append('description', 'Test carousel image');
        
        console.log(`Uploading carousel image: ${imageFiles[0]}`);
        
        const uploadResponse = await fetch(`${BASE_URL}/api/upload/carousel`, {
          method: 'POST',
          body: imageFormData
        });
        
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(`Failed to upload carousel image: ${errorData.error || uploadResponse.statusText}`);
        }
        
        const uploadResult = await uploadResponse.json();
        console.log(`✅ Successfully uploaded carousel image: ${uploadResult.url}\n`);
      }
    }
    */
    
    // Step 5: Test project deletion (warning: this would actually delete the project)
    console.log(`5️⃣ Testing project deletion`);
    console.log(`DELETE ${BASE_URL}/api/projects/${projectId}`);
    
    // This is a dry run
    console.log('⚠️ This is a dry run - no actual API call made');
    console.log(`Simulated deleting project with ID: ${projectId}\n`);
    
    /*
    // Uncomment to actually delete the project
    // WARNING: This will permanently delete the project
    const deleteResponse = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
      method: 'DELETE'
    });
    
    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json();
      throw new Error(`Failed to delete project: ${errorData.error || deleteResponse.statusText}`);
    }
    
    console.log(`✅ Successfully deleted project with ID: ${projectId}\n`);
    */
    
    console.log('✨ Full project workflow test completed successfully!');
    console.log('Note: This was a dry run with simulated API calls.');
    console.log('To run actual API calls, uncomment the API call blocks in the script.');
    
  } catch (error) {
    console.error('❌ Error testing project workflow:', error.message);
  }
}

// Run the tests
testProjectWorkflow(); 