import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

// This is a temporary endpoint for admin reset - REMOVE IN PRODUCTION
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';
const EXPIRES_IN = 60 * 60 * 24 * 30; // 30 days

export async function GET(request: NextRequest) {
  try {
    // Check for a secret parameter to prevent unauthorized access
    const url = new URL(request.url);
    const secret = url.searchParams.get('secret');
    
    if (secret !== 'temporary-reset-key') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Create JWT token for admin
    const token = sign(
      {
        username: 'admin',
        role: 'admin',
      },
      JWT_SECRET,
      { expiresIn: EXPIRES_IN }
    );
    
    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Admin token has been reset. You can now log in.',
      token
    });
    
    // Set cookies
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: EXPIRES_IN
    });
    
    // Generate a CSRF token
    const csrfToken = crypto.randomUUID();
    response.cookies.set('csrf_token', csrfToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: EXPIRES_IN
    });
    
    return response;
  } catch (error) {
    console.error('Admin reset error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 