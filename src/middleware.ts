import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import nextAuthMiddleware, { NextRequestWithAuth } from 'next-auth/middleware';

export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request });

  const sessionValid =
    session?.expires && new Date(session.expires as string).getTime() > Date.now();

  const requestUrl = request.nextUrl.pathname;

  // if the user is the authenticated and want to access home page
  // then redirect him to the main page
  if (sessionValid && requestUrl === '/') {
    const url = request.nextUrl.clone();
    url.pathname = `/main`;
    return NextResponse.redirect(url);
  }

  // if the user is not authenticated at all
  // then redirect him to the home/login page
  // if it's successfull then redirect him to the origin request page
  if (!sessionValid && requestUrl !== '/') {
    return nextAuthMiddleware(request as NextRequestWithAuth);
  }
}

/* NOTE: This represents a security risk, if developers forget to add a route to the list or gets the pattern
wrong, then we might exposse protected routes. TODO: Device a better strategy (i.e) a whitelist of free access routes
and protect everything else, although this requires carefully curating the allowed routes */
export const config = {
  matcher: [
    '/',
    '/main',
    '/invite',
    '/(build|simulate|simulations|main|explore|experiment-designer|svc|virtual-lab)(/.*)*', // Match base and nested routes
  ],
};
