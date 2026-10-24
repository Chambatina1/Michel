import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, adminCredentials, createSessionToken, verifySessionToken } from '@/lib/admin-session';

function adminUser(email: string) {
  return { id: 'admin-001', email, name: 'PS Admin', role: 'admin' };
}

// GET /api/auth — returns the admin if the session cookie is valid
export async function GET(request: NextRequest) {
  const session = await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  return NextResponse.json({ user: adminUser(session.email) });
}

// POST /api/auth — log in and set the session cookie
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

    const creds = adminCredentials();
    if (email.trim().toLowerCase() !== creds.email.toLowerCase() || password !== creds.password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const { token, maxAge } = await createSessionToken(creds.email);
    const response = NextResponse.json({
      user: adminUser(creds.email),
      message: 'Authentication successful',
    });
    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });
    return response;
  } catch (error) {
    console.error('Error in auth API:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// DELETE /api/auth — log out
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return response;
}
