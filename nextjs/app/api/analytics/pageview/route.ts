import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// Debug flag
const DEBUG = true;

// Helper function for debug logging
function debugLog(...args: unknown[]) {
  if (DEBUG) {
    console.log('[Analytics API]', ...args);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitorId, sessionId, pageName, path, referrer, isAdmin = false } = body;
    
    // Check for admin flag - if true, we skip tracking
    if (isAdmin) {
      debugLog('Skipping page view tracking for admin user');
      return NextResponse.json({ 
        success: true,
        adminSkipped: true 
      });
    }
    
    // Check if path is an admin path
    if (path.startsWith('/admin') || path === '/analytics') {
      debugLog('Skipping tracking for admin page:', path);
      return NextResponse.json({ 
        success: true,
        adminPathSkipped: true
      });
    }
    
    // Validate required fields
    if (!visitorId || !sessionId || !pageName || !path) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    debugLog('Received page view request:', { visitorId, sessionId, pageName, path });
    
    // Get user agent and IP for better visitor identification
    // These are collected but not currently used in this version
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const userAgent = request.headers.get('user-agent') || '';
    const forwardedFor = request.headers.get('x-forwarded-for');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
    
    // Process the page view in a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Try to find existing visitor
      let visitor = await tx.visitor.findUnique({
        where: { id: visitorId },
      });
      
      if (visitor) {
        debugLog('Updating existing visitor:', visitorId);
        // Update existing visitor
        visitor = await tx.visitor.update({
          where: { id: visitorId },
          data: {
            lastSeen: new Date(),
            visitCount: { increment: 1 },
            referrer: referrer || visitor.referrer, // Keep existing referrer if no new one
          },
        });
      } else {
        debugLog('Creating new visitor:', visitorId);
        // Create new visitor
        visitor = await tx.visitor.create({
          data: {
            id: visitorId,
            firstSeen: new Date(),
            lastSeen: new Date(),
            visitCount: 1,
            referrer: referrer || null,
          },
        });
      }
      
      // Handle session - find existing or create new
      let session;
      if (sessionId) {
        // Try to find the session
        session = await tx.session.findUnique({
          where: { id: sessionId }
        });
        
        if (session) {
          // Only update if the session belongs to this visitor
          if (session.visitorId === visitorId) {
            debugLog('Updating existing session:', sessionId);
            // Update session
            session = await tx.session.update({
              where: { id: sessionId },
              data: {
                endTime: new Date(), // Update the end time
                pageCount: { increment: 1 }
              }
            });
          } else {
            // Session exists but belongs to another visitor ID - create a new one
            debugLog('Session ID conflict, creating new session');
            const newSessionId = uuidv4();
            session = await tx.session.create({
              data: {
                id: newSessionId,
                visitorId,
                pageCount: 1
              }
            });
          }
        } else {
          debugLog('Creating new session (existing ID not found):', sessionId);
          // Create new session
          session = await tx.session.create({
            data: {
              id: sessionId,
              visitorId,
              pageCount: 1
            }
          });
        }
      } else {
        debugLog('Creating new session (no ID provided)');
        // Create a new session without a specific ID
        session = await tx.session.create({
          data: {
            visitorId,
            pageCount: 1
          }
        });
      }
      
      debugLog('Creating page view for path:', path);
      // Create page view linked to the session with UTC timestamp
      const currentTimestamp = new Date();
      debugLog('Current timestamp:', currentTimestamp.toISOString());
      
      const pageView = await tx.pageView.create({
        data: {
          id: uuidv4(),
          path,
          pageName,
          visitorId,
          sessionId: session.id,
          visitedAt: currentTimestamp
        },
      });
      
      return { visitor, session, pageView };
    });
    
    debugLog('Successfully processed page view:', { 
      visitorId, 
      sessionId: result.session.id,
      pageViewId: result.pageView.id,
      timestamp: result.pageView.visitedAt
    });
    
    return NextResponse.json({ 
      success: true,
      visitorId: result.visitor.id,
      sessionId: result.session.id,
      pageViewId: result.pageView.id,
      timestamp: result.pageView.visitedAt
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 