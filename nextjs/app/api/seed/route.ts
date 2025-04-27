import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

export async function GET() {
  try {
    const prisma = new PrismaClient();
    
    // Clear existing analytics data
    await prisma.$transaction([
      prisma.analyticsEvent.deleteMany(),
      prisma.pageView.deleteMany(),
      prisma.session.deleteMany(),
      prisma.visitor.deleteMany(),
      prisma.dailySummary.deleteMany(),
    ]);

    console.log('Analytics database cleared successfully');

    // Generate sample data
    const visitorCount = 5;
    const sessionCount = 10;
    const pageViewCount = 30;
    
    // Create visitors
    for (let i = 1; i <= visitorCount; i++) {
      await prisma.visitor.create({
        data: {
          id: `visitor-${i}`,
          firstSeen: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          lastSeen: new Date(),
          visitCount: Math.floor(Math.random() * 10) + 1,
          referrer: Math.random() > 0.5 ? 'https://google.com' : null,
        }
      });
    }
    
    console.log(`Created ${visitorCount} visitors`);
    
    // Create sessions
    for (let i = 1; i <= sessionCount; i++) {
      const visitorId = `visitor-${Math.floor(Math.random() * visitorCount) + 1}`;
      const startTime = new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000);
      const endTime = new Date(startTime.getTime() + Math.floor(Math.random() * 30) * 60 * 1000);
      
      await prisma.session.create({
        data: {
          startTime,
          endTime,
          sessionDuration: Math.floor((endTime.getTime() - startTime.getTime()) / 1000),
          pageCount: Math.floor(Math.random() * 5) + 1,
          visitorId
        }
      });
    }
    
    console.log(`Created ${sessionCount} sessions`);
    
    // Create page views
    const paths = [
      '/',
      '/about',
      '/projects',
      '/contact',
      '/projects/ibm-ucl-ai-islands',
      '/projects/mental-health-management-platform'
    ];
    
    const pageNames = [
      'home',
      'about',
      'projects',
      'contact',
      'project: IBM UCL AI Islands',
      'project: Mental Health Management Platform'
    ];
    
    for (let i = 1; i <= pageViewCount; i++) {
      const visitorId = `visitor-${Math.floor(Math.random() * visitorCount) + 1}`;
      const sessions = await prisma.session.findMany({
        where: { visitorId }
      });
      
      const sessionId = sessions.length > 0 
        ? sessions[Math.floor(Math.random() * sessions.length)].id 
        : null;
      
      const pathIndex = Math.floor(Math.random() * paths.length);
      
      await prisma.pageView.create({
        data: {
          path: paths[pathIndex],
          pageName: pageNames[pathIndex],
          visitedAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
          duration: Math.floor(Math.random() * 300) * 1000, // 0-300 seconds
          visitorId,
          sessionId
        }
      });
    }
    
    console.log(`Created ${pageViewCount} page views`);

    await prisma.$disconnect();

    return NextResponse.json({ success: true, message: 'Analytics database seeded successfully' });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, message: 'Error seeding database', error: String(error) },
      { status: 500 }
    );
  }
} 