import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { updateDailySummary } from '@/lib/analytics';

// Debug flag
const DEBUG = true;

// Helper function for debug logging
function debugLog(...args: unknown[]) {
  if (DEBUG) {
    console.log('[Analytics API]', ...args);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check for API key if it's configured and in production
    const apiKey = process.env.ANALYTICS_API_KEY;
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (apiKey && isProduction) {
      const requestApiKey = request.headers.get('x-api-key');
      if (requestApiKey !== apiKey) {
        return NextResponse.json(
          { error: 'Unauthorized: Invalid API key' },
          { status: 401 }
        );
      }
    } else if (apiKey && !isProduction) {
      // In development, allow the correct API key or a test-key
      const requestApiKey = request.headers.get('x-api-key');
      if (requestApiKey !== apiKey && requestApiKey !== 'test-key') {
        console.warn('Warning: Invalid API key in development mode');
        // In development, log a warning but don't block the request
      }
    }

    // Get date range from query params
    const params = new URL(request.url).searchParams;
    const startDateParam = params.get('startDate');
    const endDateParam = params.get('endDate');

    // Set default date range if not provided (last 7 days)
    const endDate = endDateParam 
      ? new Date(`${endDateParam}T23:59:59.999Z`) 
      : new Date();
    
    const startDate = startDateParam
      ? new Date(`${startDateParam}T00:00:00.000Z`)
      : new Date(endDate);
    
    if (!startDateParam) {
      startDate.setDate(startDate.getDate() - 7);
      // Ensure it's at the start of the day in UTC
      startDate.setUTCHours(0, 0, 0, 0);
    }
    
    debugLog('Requested date range:', { 
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
    
    // Check if the date range includes today
    const now = new Date();
    // Create today's date in UTC at midnight
    const today = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0, 0, 0, 0
    ));
    
    debugLog('Today in UTC:', today.toISOString());
    
    const includesCurrentDate = (
      startDate <= today && 
      endDate >= today
    );
    
    // Fetch daily summaries first
    debugLog('Fetching daily summaries...');
    let summaries = await prisma.dailySummary.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
    
    // Log the fetched summaries for debugging
    debugLog('Found summaries:', summaries.map(s => ({
      id: s.id,
      date: s.date.toISOString(),
      uniqueVisitors: s.uniqueVisitors,
      sessionCount: s.sessionCount,
      totalVisits: s.totalVisits
    })));
    
    // Then update today's summary if needed
    if (includesCurrentDate) {
      debugLog('Range includes today, updating daily summary...');
      try {
        // Force update of today's data
        const updateResult = await updateDailySummary(today);
        debugLog('Daily summary updated for today:', updateResult);
        
        // Add the updated summary to our results if it's not already there
        const todayKey = today.toISOString().split('T')[0];
        const existingSummary = summaries.find(s => {
          const summaryDate = new Date(s.date);
          return summaryDate.toISOString().split('T')[0] === todayKey;
        });
        
        // Convert updateResult to match DailySummary structure
        const formattedUpdateResult = {
          id: existingSummary?.id || -1 * Date.parse(today.toISOString().split('T')[0]),
          date: updateResult.date,
          totalVisits: updateResult.totalPageViews,
          uniqueVisitors: updateResult.uniqueVisitors,
          sessionCount: updateResult.sessionCount,
          popularPages: updateResult.popularPages,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        if (existingSummary) {
          // Replace the existing summary with the updated one
          const updatedSummaries = summaries.map(s => {
            const summaryDate = new Date(s.date);
            if (summaryDate.toISOString().split('T')[0] === todayKey) {
              return formattedUpdateResult;
            }
            return s;
          });
          summaries = updatedSummaries;
        } else {
          // Add the new summary
          summaries.push(formattedUpdateResult);
        }
      } catch (error) {
        console.error('Error updating daily summary:', error);
        // Continue even if update fails
      }
    }

    // Calculate previous period for growth comparison
    const periodDuration = endDate.getTime() - startDate.getTime();
    const previousPeriodStartDate = new Date(startDate.getTime() - periodDuration);
    const previousPeriodEndDate = new Date(startDate);
    previousPeriodEndDate.setDate(previousPeriodEndDate.getDate() - 1);

    // Group page views by pageName
    const pageViews = await prisma.pageView.groupBy({
      by: ['pageName'],
      where: {
        visitedAt: {
          gte: startDate,
          lte: endDate,
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

    // Format page views data
    const formattedPageViews = pageViews.map(view => ({
      name: view.pageName || 'Unknown',
      value: view._count.id,
    }));

    // Fetch visitor stats
    const totalVisitors = await prisma.visitor.count();

    const visitorsPreviousPeriod = await prisma.visitor.count({
      where: {
        firstSeen: {
          gte: previousPeriodStartDate,
          lte: previousPeriodEndDate,
        },
      },
    });

    const visitorsCurrentPeriod = await prisma.visitor.count({
      where: {
        firstSeen: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const newVisitorsLastWeek = await prisma.visitor.count({
      where: {
        firstSeen: {
          gte: new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000),
          lte: endDate,
        },
      },
    });

    // Calculate visitor growth
    const visitorGrowth = visitorsPreviousPeriod > 0
      ? ((visitorsCurrentPeriod - visitorsPreviousPeriod) / visitorsPreviousPeriod) * 100
      : 0;

    // Calculate page views and growth
    const totalPageViews = await prisma.pageView.count({
      where: {
        visitedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const pageViewsPreviousPeriod = await prisma.pageView.count({
      where: {
        visitedAt: {
          gte: previousPeriodStartDate,
          lte: previousPeriodEndDate,
        },
      },
    });

    // Calculate page view growth
    const pageViewGrowth = pageViewsPreviousPeriod > 0
      ? ((totalPageViews - pageViewsPreviousPeriod) / pageViewsPreviousPeriod) * 100
      : 0;
      
    // Calculate sessions and session growth
    const totalSessions = await prisma.session.count({
      where: {
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    
    const sessionsPreviousPeriod = await prisma.session.count({
      where: {
        startTime: {
          gte: previousPeriodStartDate,
          lte: previousPeriodEndDate,
        },
      },
    });
    
    // Calculate session growth
    const sessionGrowth = sessionsPreviousPeriod > 0
      ? ((totalSessions - sessionsPreviousPeriod) / sessionsPreviousPeriod) * 100
      : 0;

    // Create empty popular projects array since we no longer track projects
    const formattedProjectViews: Array<{ name: string; value: number }> = [];
    
    // Ensure we have data points for every day in the requested range
    const allDatesMap = new Map();
    
    // Create a date iterator that covers the entire range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Initialize with zero values
      allDatesMap.set(dateKey, {
        id: -1 * Date.parse(dateKey), // Create a unique negative ID based on the date's timestamp
        date: new Date(currentDate),
        totalVisits: 0,
        uniqueVisitors: 0,
        sessionCount: 0,
        popularPages: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Fill in actual data where we have it
    for (const summary of summaries) {
      const dateKey = new Date(summary.date).toISOString().split('T')[0];
      if (allDatesMap.has(dateKey)) {
        allDatesMap.set(dateKey, summary);
      }
    }
    
    // Convert the map back to an array
    const completeSummaries = Array.from(allDatesMap.values());
    debugLog(`Generated complete date range with ${completeSummaries.length} data points`);
    
    // Replace the original summaries with our complete set
    summaries = completeSummaries;

    // If we're including today and don't have a summary for it or today's data was updated,
    // create a temporary one from raw counts
    const hasValidTodayData = summaries.some(s => {
      const summaryDate = new Date(s.date);
      return summaryDate.toISOString().split('T')[0] === today.toISOString().split('T')[0]
         && s.uniqueVisitors > 0; // Must have data, not just a placeholder
    });
    
    if (includesCurrentDate && !hasValidTodayData) {
      debugLog('No valid summary found for today, creating one from raw counts');
      
      // Count today's page views
      const todayPageViews = await prisma.pageView.count({
        where: {
          visitedAt: {
            gte: today,
            lte: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
          },
        },
      });
      
      debugLog(`Found ${todayPageViews} page views for today (${today.toISOString()})`);
      
      // Get the most recent page views to verify timestamps
      const recentPageViews = await prisma.pageView.findMany({
        orderBy: {
          visitedAt: 'desc',
        },
        take: 5,
        select: {
          id: true,
          visitedAt: true,
          path: true
        }
      });
      
      debugLog('Most recent page views:', 
        recentPageViews.map(pv => ({
          id: pv.id,
          visitedAt: pv.visitedAt.toISOString(),
          path: pv.path
        }))
      );
      
      // Count today's unique visitors
      const todayUniqueVisitorIds = await prisma.pageView.findMany({
        where: {
          visitedAt: {
            gte: today,
            lte: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
          },
        },
        select: {
          visitorId: true,
        },
        distinct: ['visitorId'],
      });
      
      const todayUniqueVisitors = todayUniqueVisitorIds.length;
      
      // Count today's sessions
      const todaySessionIds = await prisma.session.findMany({
        where: {
          startTime: {
            gte: today,
            lte: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1),
          },
        },
        select: {
          id: true,
        },
      });
      
      const todaySessionCount = todaySessionIds.length;
      
      // Add a temporary summary for today
      const tempTodaySummary = {
        id: -1 * Date.parse(today.toISOString().split('T')[0]), // Unique negative ID based on today's date
        date: today,
        totalVisits: todayPageViews,
        uniqueVisitors: todayUniqueVisitors,
        sessionCount: todaySessionCount,
        popularPages: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      debugLog('Adding temporary summary for today:', tempTodaySummary);
      summaries.push(tempTodaySummary);
    }

    // Return all data
    const responseData = {
      summaries,
      pageViews: formattedPageViews,
      popularProjects: formattedProjectViews,
      stats: {
        totalVisitors,
        newVisitors: newVisitorsLastWeek,
        visitorGrowth,
        totalPageViews,
        pageViewGrowth,
        totalSessions,
        sessionGrowth,
      },
    };
    
    debugLog('Returning response with summaries count:', summaries.length);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics data',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 