// Script to update project image paths in the database
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateProjectImages() {
  try {
    console.log('Starting database update for project images...');
    
    // Get all projects
    const projects = await prisma.project.findMany({
      include: {
        images: true
      }
    });
    
    console.log(`Found ${projects.length} projects to update`);
    
    // Update each project's images
    for (const project of projects) {
      console.log(`Processing project ID: ${project.id} - ${project.title}`);
      
      // Delete existing images
      if (project.images.length > 0) {
        console.log(`  Deleting ${project.images.length} existing images`);
        await prisma.projectImage.deleteMany({
          where: {
            projectId: project.id
          }
        });
      }
      
      // Calculate which placeholder to use (1-4)
      const placeholderIndex = ((project.id - 1) % 4) + 1;
      const localImagePath = `/images/projects/project${placeholderIndex}-placeholder.jpg`;
      
      // Create new image with local path
      await prisma.projectImage.create({
        data: {
          url: localImagePath,
          alt: `${project.title} image`,
          projectId: project.id
        }
      });
      
      console.log(`  ✅ Updated project with image: ${localImagePath}`);
    }
    
    console.log('\nDatabase update completed successfully!');
    console.log('All projects now use local image paths.');
    
  } catch (error) {
    console.error('Error updating project images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update function
updateProjectImages(); 