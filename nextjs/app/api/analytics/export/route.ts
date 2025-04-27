import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Optional API key check for security
    const apiKey = request.headers.get('x-api-key');
    const configuredApiKey = process.env.ANALYTICS_API_KEY;
    
    if (configuredApiKey && apiKey !== configuredApiKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get report type from query params
    const reportType = request.nextUrl.searchParams.get('type') || 'summary';
    const startDate = request.nextUrl.searchParams.get('startDate') 
      ? new Date(request.nextUrl.searchParams.get('startDate') as string)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to 30 days ago
    
    const endDate = request.nextUrl.searchParams.get('endDate')
      ? new Date(request.nextUrl.searchParams.get('endDate') as string)
      : new Date(); // Default to today
    
    // Set end date to end of day
    endDate.setHours(23, 59, 59, 999);
    
    let csvData: string;
    let filename: string;
    
    switch (reportType) {
      case 'summary':
        // Daily summaries report
        const summaries = await prisma.dailySummary.findMany({
          where: {
            date: {
              gte: startDate,
              lte: endDate
            }
          },
          orderBy: {
            date: 'asc'
          }
        });
        
        csvData = generateSummaryCSV(summaries);
        filename = `analytics_summary_${formatDateForFilename(startDate)}_to_${formatDateForFilename(endDate)}.csv`;
        break;
        
      case 'pageviews':
        // Page views report
        const pageViews = await prisma.pageView.findMany({
          where: {
            visitedAt: {
              gte: startDate,
              lte: endDate
            }
          },
          include: {
            visitor: true
          },
          orderBy: {
            visitedAt: 'desc'
          }
        });
        
        csvData = generatePageViewsCSV(pageViews);
        filename = `pageviews_${formatDateForFilename(startDate)}_to_${formatDateForFilename(endDate)}.csv`;
        break;
        
      case 'visitors':
        // Visitors report
        const visitors = await prisma.visitor.findMany({
          where: {
            firstSeen: {
              gte: startDate,
              lte: endDate
            }
          },
          orderBy: {
            firstSeen: 'desc'
          }
        });
        
        csvData = generateVisitorsCSV(visitors);
        filename = `visitors_${formatDateForFilename(startDate)}_to_${formatDateForFilename(endDate)}.csv`;
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }
    
    // Create response with CSV data
    const response = new NextResponse(csvData, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
    
    return response;
  } catch (error) {
    console.error('Error generating CSV report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to format dates for filenames
function formatDateForFilename(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Define interface for DailySummary
interface DailySummary {
  id: number;
  date: Date;
  totalVisits: number;
  uniqueVisitors: number;
  sessionCount: number;
  popularPages: unknown;
  createdAt: Date;
  updatedAt: Date;
}

// Generate CSV for daily summaries
function generateSummaryCSV(summaries: DailySummary[]): string {
  const headers = [
    'Date',
    'Total Visits',
    'Unique Visitors',
    'Session Count'
  ];
  
  const rows = summaries.map(summary => [
    summary.date.toISOString().split('T')[0],
    summary.totalVisits.toString(),
    summary.uniqueVisitors.toString(),
    summary.sessionCount.toString()
  ]);
  
  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}

// Define interface for PageView with Visitor
interface PageView {
  id: string;
  path: string;
  pageName: string;
  visitedAt: Date;
  visitorId: string;
  sessionId: string | null;
  visitor: {
    id: string;
    firstSeen: Date;
    lastSeen: Date;
    visitCount: number;
    referrer: string | null;
  };
}

// Generate CSV for page views
function generatePageViewsCSV(pageViews: PageView[]): string {
  const headers = [
    'Date',
    'Path',
    'Page Name',
    'Visitor ID',
    'Session ID'
  ];
  
  const rows = pageViews.map(view => [
    view.visitedAt.toISOString().split('T')[0],
    escapeCsvField(view.path),
    escapeCsvField(view.pageName),
    view.visitorId,
    view.sessionId || ''
  ]);
  
  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}

// Define interface for Visitor
interface Visitor {
  id: string;
  firstSeen: Date;
  lastSeen: Date;
  visitCount: number;
  referrer: string | null;
}

// Generate CSV for visitors
function generateVisitorsCSV(visitors: Visitor[]): string {
  const headers = [
    'Visitor ID',
    'First Visit',
    'Last Visit',
    'Visit Count',
    'Referrer'
  ];
  
  const rows = visitors.map(visitor => [
    visitor.id,
    visitor.firstSeen.toISOString().split('T')[0],
    visitor.lastSeen.toISOString().split('T')[0],
    visitor.visitCount.toString(),
    escapeCsvField(visitor.referrer || '')
  ]);
  
  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}

// Helper function to escape CSV fields with commas
function escapeCsvField(field: string): string {
  if (!field) return '';
  
  // If the field contains commas, quotes, or newlines, wrap it in quotes
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    // Double up any quotes within the field
    return `"${field.replace(/"/g, '""')}"`;
  }
  
  return field;
} 