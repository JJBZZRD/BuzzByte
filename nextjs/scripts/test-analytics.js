/**
 * Simple analytics testing script
 * 
 * This script simulates page views and events to test the analytics functionality
 * Run with: node scripts/test-analytics.js
 */

const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client
const prisma = new PrismaClient();

// Create a visitor ID
const visitorId = uuidv4();
console.log(`Generated visitor ID: ${visitorId}`);

// Base URL - change this to your deployed URL or localhost
const baseUrl = 'http://localhost:3000';

// Test data
const testPages = [
  { name: 'home', url: '/' },
  { name: 'about', url: '/about' },
  { name: 'projects', url: '/projects' }
  // Project page is added dynamically after fetching project
];

const testEvents = [
  { name: 'button_click', properties: { buttonId: 'cta-button' } },
  { name: 'form_submit', properties: { formId: 'contact-form' } },
  { name: 'interaction_click', properties: { element: 'nav-link', path: '/about' } }
];

// Get test project ID
async function getTestProject() {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: 'test-project' }
    });
    
    if (project) {
      console.log(`Found test project with ID: ${project.id}`);
      // Add project page to test pages
      testPages.push({
        name: 'project',
        url: `/projects/${project.slug}`,
        projectId: project.id
      });
      return project;
    } else {
      console.log('No test project found - please run create-test-project.js first');
      return null;
    }
  } catch (error) {
    console.error('Error fetching test project:', error);
    return null;
  }
}

/**
 * Track a page view
 */
async function trackPageView(page) {
  try {
    console.log(`Tracking page view: ${page.name} (${page.url})`);
    
    const response = await fetch(`${baseUrl}/api/analytics/pageview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        visitorId,
        pageName: page.name,
        pageUrl: page.url,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to track page view: ${response.statusText}. Details: ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    console.log(`Page view tracked. Page view ID: ${data.pageViewId}`);
    return data.pageViewId;
  } catch (error) {
    console.error('Error tracking page view:', error);
    return null;
  }
}

/**
 * Update page duration
 */
async function updateDuration(pageViewId, duration) {
  try {
    console.log(`Updating duration for pageViewId ${pageViewId}: ${duration}s`);
    
    const response = await fetch(`${baseUrl}/api/analytics/duration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pageViewId,
        duration,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update duration: ${response.statusText}`);
    }
    
    console.log('Duration updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating duration:', error);
    return false;
  }
}

/**
 * Track an event
 */
async function trackEvent(eventName, properties, pageViewId) {
  try {
    console.log(`Tracking event: ${eventName}`);
    
    const response = await fetch(`${baseUrl}/api/analytics/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        visitorId,
        eventName,
        properties,
        pageViewId,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to track event: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Event tracked. Event ID: ${data.eventId}`);
    return data.eventId;
  } catch (error) {
    console.error('Error tracking event:', error);
    return null;
  }
}

/**
 * Run the test
 */
async function runTest() {
  console.log('Starting analytics test...');
  
  // Get test project first
  const testProject = await getTestProject();
  
  // Track page views with random durations
  for (const page of testPages) {
    const pageViewId = await trackPageView(page);
    
    if (pageViewId) {
      // Wait a random time and update the duration
      const duration = Math.floor(Math.random() * 120) + 10; // 10-130 seconds
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
      await updateDuration(pageViewId, duration);
      
      // Track a random event on this page
      if (Math.random() > 0.3) {
        const randomEvent = testEvents[Math.floor(Math.random() * testEvents.length)];
        await trackEvent(randomEvent.name, randomEvent.properties, pageViewId);
      }
    }
  }
  
  console.log('Analytics test completed!');
  
  // Clean up Prisma client
  await prisma.$disconnect();
}

// Run the test
runTest().catch(console.error);

async function testAnalytics() {
  console.log('Testing analytics database...');
  
  try {
    // 1. Check all visitor records
    const visitors = await prisma.visitor.findMany({
      include: {
        _count: {
          select: {
            pageViews: true
          }
        }
      }
    });

    console.log(`Total visitors in database: ${visitors.length}`);
    
    if (visitors.length > 0) {
      console.log('Sample visitors:');
      visitors.slice(0, 5).forEach(visitor => {
        console.log(`- ID: ${visitor.id}`);
        console.log(`  First seen: ${visitor.firstSeen}`);
        console.log(`  Last seen: ${visitor.lastSeen}`);
        console.log(`  Visit count: ${visitor.visitCount}`);
        console.log(`  Page views: ${visitor._count.pageViews}`);
        console.log('---');
      });
    }

    // 2. Check all page views
    const pageViews = await prisma.pageView.findMany({
      take: 10,
      orderBy: {
        visitedAt: 'desc'
      }
    });

    console.log(`Total page views in database: ${await prisma.pageView.count()}`);
    
    if (pageViews.length > 0) {
      console.log('Recent page views:');
      pageViews.forEach(view => {
        console.log(`- Path: ${view.path}`);
        console.log(`  Page name: ${view.pageName}`);
        console.log(`  Visited at: ${view.visitedAt}`);
        console.log(`  Visitor ID: ${view.visitorId}`);
        console.log('---');
      });
    }

    // 3. Check daily summaries
    const summaries = await prisma.dailySummary.findMany({
      orderBy: {
        date: 'desc'
      }
    });

    console.log(`Total daily summaries: ${summaries.length}`);
    
    if (summaries.length > 0) {
      console.log('Recent summaries:');
      summaries.slice(0, 5).forEach(summary => {
        console.log(`- Date: ${summary.date}`);
        console.log(`  Total visits: ${summary.totalVisits}`);
        console.log(`  Unique visitors: ${summary.uniqueVisitors}`);
        console.log(`  Session count: ${summary.sessionCount}`);
        console.log('---');
      });
    }

    // 4. Test creating a daily summary for today
    console.log('Creating/updating summary for today...');
    
    // Force a timezone-safe "today" in UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    
    const todayPageViews = await prisma.pageView.count({
      where: {
        visitedAt: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });
    
    const todayUniqueVisitors = (await prisma.pageView.groupBy({
      by: ['visitorId'],
      where: {
        visitedAt: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    })).length;
    
    console.log(`Today's stats (${today.toISOString().split('T')[0]}):`);
    console.log(`- Page views: ${todayPageViews}`);
    console.log(`- Unique visitors: ${todayUniqueVisitors}`);
    
    // Update the daily summary manually
    const updatedSummary = await prisma.dailySummary.upsert({
      where: {
        date: today,
      },
      create: {
        date: today,
        totalVisits: todayPageViews,
        uniqueVisitors: todayUniqueVisitors,
        sessionCount: 0,
      },
      update: {
        totalVisits: todayPageViews,
        uniqueVisitors: todayUniqueVisitors,
        updatedAt: new Date(),
      },
    });
    
    console.log('Updated daily summary:', updatedSummary);
    
    console.log('Tests completed successfully!');
  } catch (error) {
    console.error('Error testing analytics:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAnalytics(); 