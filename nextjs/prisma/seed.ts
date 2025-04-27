import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed analytics database...');

  // Clear existing analytics data
  await prisma.$transaction([
    prisma.analyticsEvent.deleteMany(),
    prisma.pageView.deleteMany(),
    prisma.session.deleteMany(),
    prisma.visitor.deleteMany(),
    prisma.dailySummary.deleteMany(),
    prisma.admin.deleteMany(),
  ]);

  console.log('Database cleared. Creating new records...');

  // Create admin user for testing
  const adminUser = await prisma.admin.create({
    data: {
      username: 'admin',
      passwordHash: '$2b$10$XNxJwN/GE3aJ5.4v1YIyUuXyUvZgtZ2NCJlxwAuWw10MFV5haX7tq', // hashed 'password'
      role: 'admin',
    },
  });

  console.log(`Created admin user: ${adminUser.username}`);

  // Create 50 visitors
  const visitorIds = [];
  for (let i = 1; i <= 50; i++) {
    const visitor = await prisma.visitor.create({
      data: {
        id: `visitor-${i}`,
        firstSeen: new Date(new Date().getTime() - (Math.random() * 30 * 24 * 60 * 60 * 1000)),
        lastSeen: new Date(),
        visitCount: Math.floor(Math.random() * 10) + 1,
        referrer: Math.random() > 0.7 ? 'https://google.com' : null,
      },
    });
    visitorIds.push(visitor.id);
    if (i === 1 || i === 2 || i === 50) {
      console.log(`Created visitor ${i}: ${visitor.id}`);
    } else if (i === 3) {
      console.log('...');
    }
  }

  console.log(`Created 50 visitors`);

  // Create 100 sessions
  const sessionIds = [];
  for (let i = 1; i <= 100; i++) {
    const visitorId = visitorIds[Math.floor(Math.random() * visitorIds.length)];
    const startTime = new Date(new Date().getTime() - (Math.random() * 30 * 24 * 60 * 60 * 1000));
    const endTime = new Date(startTime.getTime() + (Math.random() * 60 * 60 * 1000));
    
    const session = await prisma.session.create({
      data: {
        startTime,
        endTime,
        sessionDuration: Math.floor((endTime.getTime() - startTime.getTime()) / 1000),
        pageCount: Math.floor(Math.random() * 5) + 1,
        visitorId,
      },
    });
    sessionIds.push(session.id);
    if (i === 1 || i === 2 || i === 100) {
      console.log(`Created session ${i}: ${session.id}`);
    } else if (i === 3) {
      console.log('...');
    }
  }

  console.log(`Created 100 sessions`);

  // Create 300 page views
  const paths = [
    '/',
    '/about',
    '/projects',
    '/contact',
    '/projects/ibm-ucl-ai-islands',
    '/projects/mental-health-management-platform',
  ];

  const pageNames = [
    'home',
    'about',
    'projects',
    'contact',
    'project: IBM UCL AI Islands',
    'project: Mental Health Management Platform',
  ];

  for (let i = 1; i <= 300; i++) {
    const visitorId = visitorIds[Math.floor(Math.random() * visitorIds.length)];
    const sessionId = sessionIds[Math.floor(Math.random() * sessionIds.length)];
    const pathIndex = Math.floor(Math.random() * paths.length);
    
    const pageView = await prisma.pageView.create({
      data: {
        path: paths[pathIndex],
        pageName: pageNames[pathIndex],
        visitedAt: new Date(new Date().getTime() - (Math.random() * 30 * 24 * 60 * 60 * 1000)),
        duration: Math.floor(Math.random() * 300) * 1000, // 0-5 minutes in milliseconds
        visitorId,
        sessionId,
      },
    });
    
    if (i === 1 || i === 51 || i === 300) {
      console.log(`Created page view ${i}: ${pageView.id}`);
    } else if (i === 52) {
      console.log('...');
    }
  }

  console.log(`Created 300 page views`);
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