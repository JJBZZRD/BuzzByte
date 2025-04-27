import prisma from './prisma';

// Define a type for JSON serializable data for Prisma JSON fields
type JSONSerializable = 
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONSerializable }
  | JSONSerializable[];

/**
 * Track a page view
 */
export async function trackPageView({
  visitorId,
  pageName,
  pageUrl,
  referrer,
}: {
  visitorId: string;
  pageName: string;
  pageUrl: string;
  referrer?: string;
  userAgent?: string;
}) {
  try {
    // Create or update visitor
    const timestamp = new Date();
    
    // The deviceInfo was removed from the schema, so we no longer process it
    
    const visitor = await prisma.visitor.upsert({
      where: { id: visitorId },
      update: {
        lastSeen: timestamp,
        visitCount: { increment: 1 },
        referrer: referrer || undefined,
      },
      create: {
        id: visitorId,
        firstSeen: timestamp,
        lastSeen: timestamp,
        visitCount: 1,
        referrer: referrer || null,
      },
    });

    // Create page view
    const pageView = await prisma.pageView.create({
      data: {
        visitorId: visitor.id,
        pageName,
        path: pageUrl,
        visitedAt: timestamp,
      },
    });

    return { visitor, pageView };
  } catch (error) {
    console.error('Error tracking page view:', error);
    return null;
  }
}

/**
 * Update page view duration
 */
export async function updatePageViewDuration(pageViewId: string, duration: number) {
  try {
    await prisma.pageView.update({
      where: { id: pageViewId },
      data: { duration },
    });
    return true;
  } catch (error) {
    console.error('Error updating page view duration:', error);
    return false;
  }
}

// For popularPages
type PopularPage = {
  path: string;
  count: number;
};

/**
 * Update the daily summary for a specific date
 * This can be called by a cron job or manually to process raw analytics data
 */
export async function updateDailySummary(dateToProcess?: Date, isAdmin: boolean = false) {
  try {
    // Use today's date if no date is provided
    let date = dateToProcess || new Date();
    
    // Create UTC date for the start of day (midnight UTC)
    date = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0, 0, 0, 0
    ));
    
    console.log(`Updating summary for date: ${date.toISOString()} (UTC)`);
    if (isAdmin) {
      console.log('Request from admin user - admin page views will be excluded');
    }
    
    // End of day in UTC
    const endDate = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      23, 59, 59, 999
    ));
    
    console.log(`End date for query: ${endDate.toISOString()} (UTC)`);
    
    // Count page views for the day - exclude admin pages
    const pageViewsQuery = {
      where: {
        visitedAt: {
          gte: date,
          lte: endDate,
        },
        // Exclude admin pages
        path: {
          not: {
            startsWith: '/admin',
          },
        },
      },
    };
    console.log('Page views query:', JSON.stringify(pageViewsQuery));
    
    const totalPageViews = await prisma.pageView.count(pageViewsQuery);
    console.log(`Found ${totalPageViews} page views for date ${date.toISOString()}`);
    
    // List some sample page views to verify
    if (totalPageViews > 0) {
      const sampleViews = await prisma.pageView.findMany({
        where: {
          visitedAt: {
            gte: date,
            lte: endDate,
          },
          // Exclude admin pages
          path: {
            not: {
              startsWith: '/admin',
            },
          },
        },
        select: {
          id: true,
          visitedAt: true,
          path: true,
        },
        take: 5,
      });
      console.log('Sample page views:', sampleViews);
    }
    
    // Count unique visitors for the day (excluding admin pages)
    const uniqueVisitorIds = await prisma.pageView.findMany({
      where: {
        visitedAt: {
          gte: date,
          lte: endDate,
        },
        // Exclude admin pages
        path: {
          not: {
            startsWith: '/admin',
          },
        },
      },
      select: {
        visitorId: true,
      },
      distinct: ['visitorId'],
    });
    
    const uniqueVisitors = uniqueVisitorIds.length;
    
    // Count sessions for the day (exclude those that only have admin page views)
    // Since there's no isAdmin field in the Session model, we'll count sessions
    // that have at least one non-admin page view
    const sessionsWithNonAdminPageViews = await prisma.session.findMany({
      where: {
        startTime: {
          gte: date,
          lte: endDate,
        },
        pageViews: {
          some: {
            path: {
              not: {
                startsWith: '/admin',
              },
            },
          },
        },
      },
      select: {
        id: true,
      },
    });
    
    const sessionCount = sessionsWithNonAdminPageViews.length;
    
    // Get popular pages for the day (excluding admin pages)
    const pageViewsByPath = await prisma.pageView.groupBy({
      by: ['path'],
      where: {
        visitedAt: {
          gte: date,
          lte: endDate,
        },
        // Exclude admin pages
        path: {
          not: {
            startsWith: '/admin',
          },
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });
    
    const popularPages: PopularPage[] = pageViewsByPath.map(item => ({
      path: item.path,
      count: item._count.id,
    }));
    
    // Create or update summary
    const dailySummary = await prisma.dailySummary.upsert({
      where: {
        date: new Date(date.toISOString().split('T')[0]),
      },
      create: {
        date: new Date(date.toISOString().split('T')[0]),
        totalVisits: totalPageViews,
        uniqueVisitors,
        sessionCount,
        popularPages: JSON.stringify(popularPages),
      },
      update: {
        totalVisits: totalPageViews,
        uniqueVisitors,
        sessionCount,
        popularPages: JSON.stringify(popularPages),
        updatedAt: new Date(),
      },
    });
    
    return {
      date: dailySummary.date,
      totalPageViews,
      uniqueVisitors,
      sessionCount,
      popularPages,
      
      // Include these for compatibility with DailySummary
      totalVisits: totalPageViews,
      id: dailySummary.id,
      createdAt: dailySummary.createdAt,
      updatedAt: dailySummary.updatedAt
    };
  } catch (error) {
    console.error('Error updating daily summary:', error);
    throw error;
  }
}

/**
 * Tracks a user interaction
 */
export async function trackInteraction(
  visitorId: string,
  type: string,
  element: string,
  path: string,
  metadata?: Record<string, JSONSerializable>
): Promise<void> {
  console.log('Analytics interaction tracking not implemented:', {
    visitorId,
    type,
    element,
    path,
    metadata
  });
  // No-op since the interaction model doesn't exist
} 