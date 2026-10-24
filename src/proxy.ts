import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/admin-session';

// API calls that change the site or read private data require an admin session.
// Public pages keep using the GET endpoints and the public form POSTs.
function requiresAdmin(request: NextRequest): boolean {
  const { pathname, searchParams } = request.nextUrl;
  const method = request.method;
  const isRead = method === 'GET' || method === 'HEAD';

  if (pathname.startsWith('/api/admin/')) return true;
  if (pathname === '/api/upload') return true;
  if (pathname === '/api/payments/create-link') return true;
  if (pathname.startsWith('/api/whatsapp/send')) return true;
  if (pathname.startsWith('/api/chat/debug')) return true;
  if (pathname === '/api/settings') return !isRead;
  if (pathname === '/api/leads') return isRead; // POST = public contact/quote form
  if (pathname === '/api/sell-equipment') return isRead; // POST = public sell form
  if (pathname === '/api/reviews') return isRead && searchParams.get('admin') === 'true'; // POST = public review form
  if (pathname.startsWith('/api/reviews/')) return !isRead;
  if (pathname === '/api/services' || pathname.startsWith('/api/services/')) return !isRead;
  if (pathname === '/api/products' || pathname.startsWith('/api/products/')) return !isRead;
  return false;
}

export async function proxy(request: NextRequest) {
  if (!requiresAdmin(request)) return NextResponse.next();
  const session = await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: 'Sesion de administrador requerida. Inicie sesion de nuevo.' }, { status: 401 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
