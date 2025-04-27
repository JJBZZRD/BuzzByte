import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// JWT secret key for token signing
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development_only';
// 30 days expiry
const EXPIRES_IN = 60 * 60 * 24 * 30;

export async function POST(request: NextRequest) {
  try {
    // Get the credentials from the request
    const body = await request.json();
    const { username, password } = body;
    
    console.log('Login attempt:', { username });

    // Find the admin user in the database
    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    console.log('Admin lookup result:', { found: !!admin });

    // Check if admin exists
    if (!admin) {
      console.log('Admin not found');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password using bcrypt
    console.log('Attempting password verification with bcrypt');
    const isPasswordValid = await compare(password, admin.passwordHash);
    console.log('Password verification result:', { isPasswordValid });
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create JWT token
    console.log('Creating JWT token');
    const token = sign(
      {
        username,
        role: admin.role,
        adminId: admin.id
      },
      JWT_SECRET,
      { expiresIn: EXPIRES_IN }
    );

    // Update last login time
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() }
    });

    console.log('Login successful, returning token');
    
    // Create response with token in cookie
    const response = NextResponse.json({ 
      success: true,
      message: 'Login successful' 
    });
    
    // Set cookie with the token
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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 