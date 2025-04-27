import { NextRequest, NextResponse } from 'next/server';
import { updateDailySummary } from '@/lib/analytics';

// This endpoint can be called by a cron job to update analytics summaries
export async function GET(request: NextRequest) {
  try {
    // Optional API key check for security
    const apiKey = request.headers.get('x-api-key');
    const configuredApiKey = process.env.ANALYTICS_API_KEY;
    
    if (configuredApiKey && apiKey !== configuredApiKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get date from query params or use current date
    const dateParam = request.nextUrl.searchParams.get('date');
    const date = dateParam ? new Date(dateParam) : new Date();
    
    // Update the summary for the specified date
    await updateDailySummary(date);
    
    return NextResponse.json({
      success: true,
      message: `Successfully updated analytics summary for ${date.toISOString().split('T')[0]}`
    });
  } catch (error) {
    console.error('Error updating analytics summary:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 