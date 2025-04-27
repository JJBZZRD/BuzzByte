// Script to reset all analytics data
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetAnalytics() {
  console.log('Starting analytics data reset...');

  try {
    // Log current counts before deletion
    const beforeCounts = {
      dailySummaries: await prisma.dailySummary.count(),
      pageViews: await prisma.pageView.count(),
      sessions: await prisma.session.count(),
      visitors: await prisma.visitor.count(),
      events: await prisma.analyticsEvent.count()
    };
    
    console.log('Current counts before reset:', beforeCounts);

    // Clear all analytics tables in a transaction to ensure data consistency
    const result = await prisma.$transaction([
      // Delete analytics events
      prisma.analyticsEvent.deleteMany({}),
      
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
      eventsDeleted: result[0].count,
      dailySummariesDeleted: result[1].count,
      pageViewsDeleted: result[2].count,
      sessionsDeleted: result[3].count,
      visitorsDeleted: result[4].count
    });
    
    // Verify all counts are now zero
    const afterCounts = {
      dailySummaries: await prisma.dailySummary.count(),
      pageViews: await prisma.pageView.count(),
      sessions: await prisma.session.count(),
      visitors: await prisma.visitor.count(),
      events: await prisma.analyticsEvent.count()
    };
    
    console.log('Current counts after reset:', afterCounts);
    
    console.log('Your analytics data has been reset. You can now start with a clean slate.');
  } catch (error) {
    console.error('Error resetting analytics data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the reset function
resetAnalytics(); 