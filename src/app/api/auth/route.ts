import { NextRequest, NextResponse } from 'next/server';

// Hardcoded admin credentials (works even if database is not initialized)
const ADMIN_CREDENTIALS = {
  email: 'admin@psmedicaldevices.com',
  password: 'admin123',
  name: 'PS Admin',
  role: 'admin',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Direct credential check (no database dependency)
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      return NextResponse.json({
        user: {
          id: 'admin-001',
          email: ADMIN_CREDENTIALS.email,
          name: ADMIN_CREDENTIALS.name,
          role: ADMIN_CREDENTIALS.role,
        },
        message: 'Authentication successful',
      });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Error in auth API:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
