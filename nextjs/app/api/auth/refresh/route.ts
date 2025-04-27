import { NextRequest, NextResponse } from 'next/server';
import { verify, sign } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// JWT secret key for token verification and signing
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';
// 30 days expiry
const EXPIRES_IN = 60 * 60 * 24 * 30;

export async function POST(request: NextRequest) {
  try {
    // Get token from HTTP-only cookie
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'No token provided' }, { status: 400 });
    }

    // Verify existing token
    try {
      const decoded = verify(token, JWT_SECRET) as { username: string; role: string; adminId: number };
      
      // Verify admin still exists in database
      const admin = await prisma.admin.findUnique({
        where: { id: decoded.adminId }
      });
      
      if (!admin) {
        return NextResponse.json({ success: false, error: 'Admin not found' }, { status: 401 });
      }
      
      // Create new token with refreshed expiration
      const newToken = sign(
        {
          username: decoded.username,
          role: decoded.role,
          adminId: decoded.adminId
        },
        JWT_SECRET,
        { expiresIn: EXPIRES_IN }
      );

      // Create response with success message
      const response = NextResponse.json({ 
        success: true, 
        expiresIn: EXPIRES_IN 
      });
      
      // Set the new token as an HTTP-only cookie
      response.cookies.set('admin_token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: EXPIRES_IN
      });
      
      return response;
    } catch (error) {
      console.error('Token refresh error:', error);
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 