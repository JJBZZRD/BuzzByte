const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Define local placeholder images for each project
const projectPlaceholders = [
  { id: 1, imagePath: '/images/projects/project1-placeholder.jpg', alt: 'AI Islands Project' },
  { id: 2, imagePath: '/images/projects/project2-placeholder.jpg', alt: 'ChemUCL Dashboard' },
  { id: 3, imagePath: '/images/projects/project3-placeholder.jpg', alt: 'Hospital Management System' },
  { id: 4, imagePath: '/images/projects/project4-placeholder.jpg', alt: 'Mental Health Monitoring Platform' },
  // Add more as needed
];

async function updateProjectImages() {
  console.log('Updating project images in the database...');
  
  try {
    for (const project of projectPlaceholders) {
      // First, delete any existing images for this project
      await prisma.projectImage.deleteMany({
        where: { projectId: project.id }
      });
      
      // Create a new image with the local path
      await prisma.projectImage.create({
        data: {
          url: project.imagePath,
          alt: project.alt,
          projectId: project.id
        }
      });
      
      console.log(`Updated images for project ID: ${project.id}`);
    }
    
    console.log('Successfully updated all project images!');
  } catch (error) {
    console.error('Error updating project images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update function
updateProjectImages(); 