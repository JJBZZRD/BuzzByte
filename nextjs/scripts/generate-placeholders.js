const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Project placeholder data
const projects = [
  {
    id: 1,
    title: 'AI Islands Project',
    subtitle: 'Offline AI Library Application',
    colors: ['#3b82f6', '#8b5cf6'] // Blue to purple
  },
  {
    id: 2,
    title: 'ChemUCL Dashboard',
    subtitle: 'Laboratory Management System',
    colors: ['#10b981', '#3b82f6'] // Green to blue
  },
  {
    id: 3,
    title: 'Hospital Management System',
    subtitle: 'Healthcare Administration Platform',
    colors: ['#f43f5e', '#8b5cf6'] // Red to purple
  },
  {
    id: 4,
    title: 'Mental Health Platform',
    subtitle: 'Patient Monitoring System',
    colors: ['#f97316', '#ec4899'] // Orange to pink
  }
];

// Output directory
const outputDir = path.resolve(__dirname, '../public/images/projects');

// Make sure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created directory: ${outputDir}`);
}

// Canvas dimensions
const width = 800;
const height = 450;

// Create placeholder images
async function generatePlaceholders() {
  console.log('Generating placeholder images...');
  
  for (const project of projects) {
    // Create canvas
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    
    // Create gradient background
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, project.colors[0]);
    gradient.addColorStop(1, project.colors[1]);
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    
    // Add text
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Project title (large)
    context.font = 'bold 40px Arial';
    context.fillText(project.title, width / 2, height / 2 - 30);
    
    // Project subtitle (smaller)
    context.font = '24px Arial';
    context.fillText(project.subtitle, width / 2, height / 2 + 30);
    
    // Project ID as a subtle watermark
    context.font = 'bold 200px Arial';
    context.fillStyle = 'rgba(255, 255, 255, 0.1)';
    context.fillText(project.id, width / 2, height / 2);
    
    // Export as JPEG
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
    const outputPath = path.join(outputDir, `project${project.id}-placeholder.jpg`);
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Generated placeholder for "${project.title}" at ${outputPath}`);
  }
  
  console.log('All placeholders generated successfully!');
}

// Run the generator
generatePlaceholders().catch(err => {
  console.error('Error generating placeholders:', err);
}); 