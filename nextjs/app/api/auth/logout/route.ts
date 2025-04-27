import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check for CSRF token
    const csrfToken = request.headers.get('X-CSRF-Token');
    const storedCsrfToken = request.cookies.get('csrf_token')?.value;
    
    if (!csrfToken || !storedCsrfToken || csrfToken !== storedCsrfToken) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }
    
    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
    
    // Clear cookies
    response.cookies.delete('admin_token');
    response.cookies.delete('csrf_token');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 