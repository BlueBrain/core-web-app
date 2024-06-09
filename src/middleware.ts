import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import nextAuthMiddleware, { NextRequestWithAuth } from 'next-auth/middleware';

const FREE_ACCESS_PAGES = ['/', '/log-in', '/about*'];

/* Don't allow arbitray regex to avoid accidentally leaking protected pages
Only two patterns allowed, exact match or /path* which matches the path
and all sub-routes
*/
function isFreeAccessRoute(requestUrl: string) {
  return FREE_ACCESS_PAGES.some((p) => {
    if (p === requestUrl) return true;
    return p.endsWith('*') && requestUrl.startsWith(p.slice(0, -1));
  });
}

export async function middleware(request: NextRequest) {
  const session = await getToken<false, { accessTokenExpires: number }>({ req: request });
  const sessionValid = session && Date.now() < session.accessTokenExpires;
  const requestUrl = request.nextUrl.pathname;

  // If the user is authenticated and wants to access the home page or log-in page
  // then redirect to the main page
  if (sessionValid && (requestUrl === '/' || requestUrl === '/log-in')) {
    const url = request.nextUrl.clone();
    url.pathname = `/main`;
    return NextResponse.redirect(url);
  }

  // Let them through if they're trying to access a public page or they have a valid session
  if (isFreeAccessRoute(requestUrl) || sessionValid) {
    return NextResponse.next();
  }

  // Redirect to Keycloak's login and if successful back to the originally requested page
  return nextAuthMiddleware(request as NextRequestWithAuth);
}
