const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client
const prisma = new PrismaClient();

async function createTestProject() {
  try {
    console.log('Creating test project...');
    
    // Check if test project already exists
    const existingProject = await prisma.project.findUnique({
      where: { slug: 'test-project' }
    });
    
    if (existingProject) {
      console.log('Test project already exists with ID:', existingProject.id);
      return existingProject;
    }
    
    // Create a test project
    const project = await prisma.project.create({
      data: {
        slug: 'test-project',
        title: 'Test Project',
        description: 'A project for testing analytics',
        role: 'Tester',
        imageGradient: 'linear-gradient(to right, #4a00e0, #8e2de2)',
        longDescription: 'This is a test project created for testing analytics functionality.',
        tags: {
          create: [
            { name: 'Test' },
            { name: 'Analytics' }
          ]
        }
      }
    });
    
    console.log('Test project created with ID:', project.id);
    console.log('Project details:', project);
    
    return project;
  } catch (error) {
    console.error('Error creating test project:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
createTestProject().catch(console.error); 