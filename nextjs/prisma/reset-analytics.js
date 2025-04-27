// Script to reset all analytics data
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetAnalytics() {
  console.log('Starting analytics data reset...');

  try {
    // Clear all analytics tables in a transaction to ensure data consistency
    const result = await prisma.$transaction([
      // Delete analytics summaries
      prisma.dailySummary.deleteMany({}),
      
      // Delete page views
      prisma.pageView.deleteMany({}),
      
      // Delete sessions
      prisma.session.deleteMany({}),
      
      // Delete visitors (this will cascade to related records)
      prisma.visitor.deleteMany({})
    ]);

    console.log('Analytics data reset completed successfully.');
    console.log('Results:', {
      dailySummariesDeleted: result[0].count,
      pageViewsDeleted: result[1].count,
      sessionsDeleted: result[2].count,
      visitorsDeleted: result[3].count
    });
    
    console.log('Your analytics data has been reset. You can now start with a clean slate.');
  } catch (error) {
    console.error('Error resetting analytics data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the reset function
resetAnalytics(); 