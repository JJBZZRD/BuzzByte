const { v4: uuidv4 } = require('uuid');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client
const prisma = new PrismaClient();

// Sample data sets for demonstration purposes
const deviceTypes = ['desktop', 'mobile', 'tablet', 'console', 'smarttv'];
const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Samsung Browser'];
const operatingSystems = ['Windows', 'macOS', 'iOS', 'Android', 'Linux', 'Chrome OS'];
const pageNames = ['home', 'about', 'projects', 'contact'];

// Helper function to generate a random past date
function randomPastDate(maxDaysAgo) {
  const now = new Date();
  const pastDate = new Date(now);
  pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * maxDaysAgo));
  return pastDate;
}

async function generateSampleData() {
  try {
    console.log('Generating sample analytics data...');
    
    // Generate random sample data
    const sampleCount = 50; // Number of sample records to create
    const now = new Date();
    const sampleData = [];
    
    for (let i = 0; i < sampleCount; i++) {
      const firstSeen = randomPastDate(90);
      const lastSeen = new Date(); // current date for last seen
      
      sampleData.push({
        visitorId: uuidv4(),
        firstSeen,
        lastSeen,
        visitCount: Math.floor(Math.random() * 10) + 1,
        deviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        browserVersion: `${80 + Math.floor(Math.random() * 20)}.0.${Math.floor(Math.random() * 5000)}`,
        os: operatingSystems[Math.floor(Math.random() * operatingSystems.length)],
        osVersion: `${10 + Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 5)}`
      });
    }
    
    console.log(`Creating ${sampleData.length} sample visitors...`);
    
    // Create sample visitors
    await prisma.visitor.createMany({
      data: sampleData,
      skipDuplicates: true
    });
    
    // Create sample page views
    console.log('Fetching created visitors...');
    const visitors = await prisma.visitor.findMany({
      take: sampleCount
    });
    
    const pageViewData = [];
    
    for (const visitor of visitors) {
      const viewCount = Math.floor(Math.random() * 5) + 1;
      
      for (let i = 0; i < viewCount; i++) {
        const pageName = pageNames[Math.floor(Math.random() * pageNames.length)];
        const path = pageName === 'home' ? '/' : `/${pageName}`;
        
        pageViewData.push({
          id: uuidv4(),
          path,
          pageName,
          visitorId: visitor.visitorId,
          visitedAt: visitor.lastSeen,
          duration: Math.floor(Math.random() * 300) + 10 // 10-310 seconds
        });
      }
    }
    
    // Create page views one by one to avoid collisions
    console.log(`Creating ${pageViewData.length} sample page views...`);
    for (const pageView of pageViewData) {
      await prisma.pageView.create({
        data: pageView
      });
    }
    
    // Create some project page views if we have projects
    const projects = await prisma.project.findMany({
      take: 10
    });
    
    if (projects.length > 0) {
      console.log('Adding project page views...');
      const projectPageViews = [];
      
      for (const visitor of visitors) {
        // 50% chance of viewing a project
        if (Math.random() > 0.5) {
          const project = projects[Math.floor(Math.random() * projects.length)];
          
          projectPageViews.push({
            id: uuidv4(),
            path: `/projects/${project.slug}`,
            pageName: 'project',
            visitorId: visitor.visitorId,
            visitedAt: visitor.lastSeen,
            duration: Math.floor(Math.random() * 300) + 30 // 30-330 seconds
          });
        }
      }
      
      if (projectPageViews.length > 0) {
        console.log(`Creating ${projectPageViews.length} project page views...`);
        for (const projectView of projectPageViews) {
          await prisma.pageView.create({
            data: projectView
          });
        }
      }
    }
    
    // Update the daily summary
    console.log('Updating daily summaries...');
    await updateDailySummary();
    
    console.log('Sample data generation complete!');
  } catch (error) {
    console.error('Error generating sample data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to update daily summary
async function updateDailySummary() {
  // Get the last 30 days
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    dates.push(date);
  }
  
  // Process each date
  for (const date of dates) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    
    try {
      // Get page views for the day
      const pageViews = await prisma.pageView.findMany({
        where: {
          visitedAt: {
            gte: date,
            lt: nextDate
          }
        }
      });
      
      if (pageViews.length === 0) continue;
      
      console.log(`Processing summary for ${date.toISOString().split('T')[0]} with ${pageViews.length} views`);
      
      // Calculate metrics
      const visitorIds = pageViews.map(pv => pv.visitorId);
      const uniqueVisitorIds = [...new Set(visitorIds)];
      const totalVisits = pageViews.length;
      const uniqueVisitors = uniqueVisitorIds.length;
      
      // Calculate average duration
      const averageDuration = pageViews.reduce((sum, pv) => sum + (pv.duration || 0), 0) / pageViews.length;
      
      // Calculate bounce rate
      const visitorsPageViewCounts = new Map();
      pageViews.forEach(pv => {
        const count = visitorsPageViewCounts.get(pv.visitorId) || 0;
        visitorsPageViewCounts.set(pv.visitorId, count + 1);
      });
      
      const bouncedVisitors = Array.from(visitorsPageViewCounts.values()).filter(count => count === 1).length;
      const bounceRate = uniqueVisitors > 0 ? bouncedVisitors / uniqueVisitors : 0;
      
      // Calculate breakdowns
      const pageBreakdown = {};
      const referrerBreakdown = {};
      const deviceBreakdown = {};
      const browserBreakdown = {};
      
      // Page breakdown
      pageViews.forEach(pv => {
        pageBreakdown[pv.pageName] = (pageBreakdown[pv.pageName] || 0) + 1;
      });
      
      // Get visitors for the day
      const dayVisitors = await prisma.visitor.findMany({
        where: {
          visitorId: {
            in: uniqueVisitorIds
          }
        }
      });
      
      // Visitor breakdowns
      dayVisitors.forEach(visitor => {
        // Referrer tracking
        referrerBreakdown['direct'] = (referrerBreakdown['direct'] || 0) + 1;
        
        // Device tracking
        if (visitor.deviceType) {
          deviceBreakdown[visitor.deviceType] = (deviceBreakdown[visitor.deviceType] || 0) + 1;
        }
        
        // Browser tracking
        if (visitor.browser) {
          browserBreakdown[visitor.browser] = (browserBreakdown[visitor.browser] || 0) + 1;
        }
      });
      
      // Update or create summary
      await prisma.analyticsSummary.upsert({
        where: { date },
        update: {
          totalVisits,
          uniqueVisitors,
          averageDuration,
          bounceRate,
          pageBreakdown,
          referrerBreakdown,
          deviceBreakdown,
          browserBreakdown,
        },
        create: {
          date,
          totalVisits,
          uniqueVisitors,
          averageDuration,
          bounceRate,
          pageBreakdown,
          referrerBreakdown,
          deviceBreakdown,
          browserBreakdown,
        }
      });
    } catch (error) {
      console.error(`Error processing summary for ${date.toISOString().split('T')[0]}:`, error);
    }
  }
}

// Run the function
generateSampleData(); 