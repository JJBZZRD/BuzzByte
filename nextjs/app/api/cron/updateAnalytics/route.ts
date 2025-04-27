import { NextRequest, NextResponse } from 'next/server';
import { updateDailySummary } from '@/lib/analytics';

// This route is intended to be called by a cron job to update analytics daily
export async function GET(request: NextRequest) {
  try {
    // Check for admin header
    const isAdmin = request.headers.get('x-is-admin') === 'true';
    
    // Check for a cron secret if you want to secure this endpoint
    // const cronSecret = request.headers.get('x-cron-secret');
    // if (cronSecret !== process.env.CRON_SECRET) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Update analytics for today instead of yesterday (default behavior)
    const today = new Date();
    const result = await updateDailySummary(today, isAdmin);
    
    // Create response with data
    const response = NextResponse.json({
      success: true,
      message: 'Daily analytics summary updated successfully',
      date: result.date,
      totalVisits: result.totalPageViews,
      uniqueVisitors: result.uniqueVisitors,
      isAdminRequest: isAdmin
    }, { status: 200 });
    
    // Add CORS headers to allow calling from browser
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-api-key, x-is-admin');
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    return response;
  } catch (error) {
    console.error('Error updating analytics:', error);
    
    // Create error response
    const errorResponse = NextResponse.json({ 
      success: false, 
      error: 'Failed to update analytics',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
    
    // Add CORS headers to allow calling from browser
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-api-key, x-is-admin');
    errorResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    return errorResponse;
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  
  return response;
} 