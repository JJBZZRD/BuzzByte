// JavaScript version of the seed script
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

// Helper to generate random dates within a range
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Generate a random visitor ID
function generateVisitorId() {
  return uuidv4();
}

// Generate random session ID
function generateSessionId() {
  return uuidv4();
}

// Sample page names
const pageNames = [
  'home',
  'about',
  'projects',
  'project-detail',
  'contact',
  'blog'
];

// Sample paths
const paths = [
  '/',
  '/about',
  '/projects',
  '/projects/ibm-ucl-ai-islands',
  '/projects/mental-health-management-platform',
  '/projects/chemucl-inventory-system',
  '/projects/humanitarian-management-system',
  '/contact',
  '/blog'
];

async function main() {
  console.log('Starting to seed analytics database...');

  // Clear existing data
  await prisma.$transaction([
    prisma.pageView.deleteMany(),
    prisma.session.deleteMany(),
    prisma.visitor.deleteMany(),
    prisma.dailySummary.deleteMany(),
    prisma.admin.deleteMany(), // Clear admin accounts
  ]);

  console.log('Database cleared. Creating new analytics records...');

  // Create admin user using environment variables if available
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.admin.create({
    data: {
      username: adminUsername,
      passwordHash: adminPasswordHash,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
  console.log('Admin user created:', admin.username);

  // Create visitors (50)
  const visitors = [];
  for (let i = 0; i < 50; i++) {
    const visitorId = generateVisitorId();
    const firstSeen = randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());
    
    const visitor = await prisma.visitor.create({
      data: {
        id: visitorId,
        firstSeen,
        lastSeen: randomDate(firstSeen, new Date()),
        visitCount: Math.floor(Math.random() * 10) + 1,
        referrer: Math.random() > 0.7 ? 'https://google.com' : null,
      }
    });
    
    visitors.push(visitor);
    console.log(`Created visitor ${i + 1}/50`);
  }

  // Create sessions (100)
  const sessions = [];
  for (let i = 0; i < 100; i++) {
    const visitorId = visitors[Math.floor(Math.random() * visitors.length)].id;
    const startTime = randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());
    const sessionDuration = Math.floor(Math.random() * 1800) + 60; // 1-30 minutes
    
    const endTime = new Date(startTime.getTime() + sessionDuration * 1000);
    
    const session = await prisma.session.create({
          data: {
        id: generateSessionId(),
        visitorId,
        startTime,
        endTime,
        sessionDuration,
        pageCount: Math.floor(Math.random() * 8) + 1
      }
    });
    
    sessions.push(session);
    console.log(`Created session ${i + 1}/100`);
  }

  // Create page views (300)
  for (let i = 0; i < 300; i++) {
    const session = sessions[Math.floor(Math.random() * sessions.length)];
    const pageName = pageNames[Math.floor(Math.random() * pageNames.length)];
    const path = paths[Math.floor(Math.random() * paths.length)];
    
    // Use a date within the session timeframe
    const visitedAt = randomDate(session.startTime, session.endTime);
    
    await prisma.pageView.create({
          data: {
        id: uuidv4(),
        visitorId: session.visitorId,
        sessionId: session.id,
        pageName,
        path,
        visitedAt
      }
    });
    
    if (i % 50 === 0) {
      console.log(`Created page view ${i + 1}/300`);
    }
  }

  console.log('Analytics database seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 