import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';

export async function GET(request: NextRequest) {
  try {
    // Get the token from cookies
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.json({ 
        authenticated: false,
        message: 'No authentication token' 
      }, { status: 401 });
    }
    
    try {
      // Verify the token
      const decoded = verify(token, JWT_SECRET) as { username: string, adminId: number };
      
      // Verify the admin exists in the database
      const admin = await prisma.admin.findUnique({
        where: { id: decoded.adminId }
      });
      
      if (!admin) {
        return NextResponse.json({ 
          authenticated: false,
          message: 'Admin not found' 
        }, { status: 401 });
      }
      
      return NextResponse.json({ 
        authenticated: true, 
        username: decoded.username,
        role: admin.role 
      });
    } catch (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      error
    ) {
      // Token verification failed
      return NextResponse.json({ 
        authenticated: false,
        message: 'Invalid token' 
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ 
      authenticated: false,
      error: 'Internal server error' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 