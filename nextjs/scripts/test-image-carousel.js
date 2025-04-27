// Test script for ImageCarouselUploader functionality
// Run with: node scripts/test-image-carousel.js

// This script simulates the core functionality of the ImageCarouselUploader component
// It tests the temporary image handling and ID generation logic

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { createCanvas, loadImage } = require('canvas');

// Configuration
const testImagesDir = path.join(__dirname, 'test-images');
const outputDir = path.join(__dirname, 'test-output');

// Make sure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Make sure test images directory exists
if (!fs.existsSync(testImagesDir)) {
  fs.mkdirSync(testImagesDir, { recursive: true });
  console.log(`Created test images directory at: ${testImagesDir}`);
  console.log('Please add some test images to this directory before running this script.\n');
}

// Create sample placeholder images if needed
async function createSampleImages() {
  if (fs.readdirSync(testImagesDir).filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file)).length === 0) {
    console.log('No test images found. Creating sample placeholder images...');
    
    const width = 400;
    const height = 300;
    
    for (let i = 1; i <= 3; i++) {
      // Create canvas
      const canvas = createCanvas(width, height);
      const context = canvas.getContext('2d');
      
      // Create gradient background based on index
      const colors = [
        ['#3b82f6', '#8b5cf6'], // Blue to purple
        ['#10b981', '#3b82f6'], // Green to blue
        ['#f43f5e', '#8b5cf6']  // Red to purple
      ];
      
      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, colors[i-1][0]);
      gradient.addColorStop(1, colors[i-1][1]);
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
      
      // Add text
      context.fillStyle = 'white';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.font = 'bold 24px Arial';
      context.fillText(`Test Image ${i}`, width / 2, height / 2);
      
      // Export as JPEG
      const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
      const filePath = path.join(testImagesDir, `test-image-${i}.jpg`);
      fs.writeFileSync(filePath, buffer);
      
      console.log(`Created sample image: ${filePath}`);
    }
    console.log('Sample images created successfully!\n');
  }
}

// Simulate the core functionality of ImageCarouselUploader
class ImageCarouselTester {
  constructor(projectTitle, projectId = null) {
    this.projectTitle = projectTitle;
    this.projectId = projectId;
    this.images = [];
    this.tempImageFiles = new Map();
  }
  
  // Simulate the getTempProjectId method
  getTempProjectId() {
    return `temp-${Date.now()}`;
  }
  
  // Simulate the handleSingleFileUpload method for temporary images
  async handleSingleFileUpload(filePath) {
    const fileName = path.basename(filePath);
    const fileStats = fs.statSync(filePath);
    const fileType = `image/${path.extname(filePath).substring(1)}`;
    
    // If there's no actual project ID yet, use local preview
    if (!this.projectId) {
      // Create a temporary ID for this image
      const tempId = `temp-${Date.now()}`;
      
      // In a real browser environment, we'd use URL.createObjectURL(file)
      // Here we'll just copy the file to our output dir and use that path
      const outputPath = path.join(outputDir, `${tempId}-${fileName}`);
      fs.copyFileSync(filePath, outputPath);
      
      // Create a sample file object
      const fileObj = {
        name: fileName,
        size: fileStats.size,
        type: fileType,
        path: filePath
      };
      
      // Add to temp files map
      this.tempImageFiles.set(tempId, fileObj);
      
      // Create new image object
      const newImage = {
        id: tempId, 
        url: outputPath,
        description: '',
        fileName: fileName,
        isNew: true,
        order: this.images.length
      };
      
      // Update images array
      this.images.push(newImage);
      
      console.log(`Added temporary image: ${fileName} with ID ${tempId}`);
      return { success: true, image: newImage };
    }
    
    // If we have a project ID, simulate an API call
    console.log(`Simulating API upload for project ID: ${this.projectId}`);
    
    // Create a unique filename with original extension
    const uniqueFileName = `${uuidv4()}${path.extname(fileName)}`;
    const uploadPath = path.join(outputDir, uniqueFileName);
    
    // Copy the file to simulate upload
    fs.copyFileSync(filePath, uploadPath);
    
    // Create the image object that would be returned from API
    const newImage = {
      id: uuidv4(),
      url: uploadPath,
      description: '',
      fileName: fileName,
      isNew: true,
      order: this.images.length
    };
    
    // Add to images array
    this.images.push(newImage);
    
    console.log(`Uploaded image to project ${this.projectId}: ${fileName}`);
    return { success: true, image: newImage };
  }
  
  // Update image description
  updateDescription(id, description) {
    const index = this.images.findIndex(img => img.id === id);
    if (index !== -1) {
      this.images[index].description = description;
      console.log(`Updated description for image ${id}`);
      return true;
    }
    return false;
  }
  
  // Remove an image
  removeImage(id) {
    const index = this.images.findIndex(img => img.id === id);
    if (index !== -1) {
      const removedImage = this.images.splice(index, 1)[0];
      console.log(`Removed image: ${removedImage.fileName}`);
      
      // Also remove from temp files if needed
      if (this.tempImageFiles.has(id)) {
        this.tempImageFiles.delete(id);
        console.log(`Removed from temporary files map: ${id}`);
      }
      
      return true;
    }
    return false;
  }
  
  // Get current state
  getState() {
    return {
      images: this.images,
      tempImageFiles: Object.fromEntries(this.tempImageFiles)
    };
  }
}

// Main test function
async function testImageCarousel() {
  console.log('🔍 Testing Image Carousel functionality...\n');
  
  try {
    // Ensure we have test images
    await createSampleImages();
    
    // Test scenario 1: New project (no project ID)
    console.log('\n1️⃣ Testing with new project (no project ID)');
    const newProjectTester = new ImageCarouselTester('New Test Project');
    
    // Get test images
    const testImages = fs.readdirSync(testImagesDir)
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(file => path.join(testImagesDir, file));
    
    // Upload each test image
    for (const imagePath of testImages) {
      await newProjectTester.handleSingleFileUpload(imagePath);
    }
    
    // Test updating a description
    if (newProjectTester.images.length > 0) {
      const firstImageId = newProjectTester.images[0].id;
      newProjectTester.updateDescription(firstImageId, 'This is a test description');
      console.log(`Updated first image description: ${newProjectTester.images[0].description}`);
    }
    
    // Test removing an image
    if (newProjectTester.images.length > 1) {
      const secondImageId = newProjectTester.images[1].id;
      newProjectTester.removeImage(secondImageId);
      console.log(`After removal, remaining images: ${newProjectTester.images.length}`);
    }
    
    // Print current state
    console.log('\nFinal state for new project test:');
    console.log(`- ${newProjectTester.images.length} images in carousel`);
    console.log(`- ${newProjectTester.tempImageFiles.size} images in temporary files map`);
    
    // Test scenario 2: Existing project
    console.log('\n2️⃣ Testing with existing project (with project ID)');
    const existingProjectTester = new ImageCarouselTester('Existing Test Project', 999);
    
    // Upload a test image
    if (testImages.length > 0) {
      await existingProjectTester.handleSingleFileUpload(testImages[0]);
      console.log(`Added image to existing project with ID: ${existingProjectTester.projectId}`);
    }
    
    // Print current state
    console.log('\nFinal state for existing project test:');
    console.log(`- ${existingProjectTester.images.length} images in carousel`);
    console.log(`- ${existingProjectTester.tempImageFiles.size} images in temporary files map`);
    
    console.log('\n✨ Image carousel tests completed successfully!');
    console.log(`Test output files location: ${outputDir}`);
    
  } catch (error) {
    console.error('❌ Error testing image carousel:', error);
  }
}

// Run the tests
testImageCarousel(); 