import { NextRequest, NextResponse } from 'next/server';
import { trackPageView } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const visitorId = request.headers.get('x-visitor-id');
    
    if (!visitorId) {
      return NextResponse.json({ error: 'Missing visitor ID' }, { status: 400 });
    }
    
    const body = await request.json();
    const { path, pageName } = body;
    
    if (!path || !pageName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    await trackPageView({
      visitorId,
      pageName,
      pageUrl: path,
      referrer: body.referrer,
      userAgent: request.headers.get('user-agent') || undefined
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking page view:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 