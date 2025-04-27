import { NextRequest, NextResponse } from 'next/server';
import { trackInteraction } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const visitorId = request.headers.get('x-visitor-id');
    
    if (!visitorId) {
      return NextResponse.json({ error: 'Missing visitor ID' }, { status: 400 });
    }
    
    const body = await request.json();
    const { type, element, path, metadata } = body;
    
    if (!type || !element || !path) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    await trackInteraction(visitorId, type, element, path, metadata);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking interaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 