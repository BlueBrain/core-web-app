import { NextResponse, NextRequest, userAgent } from 'next/server';
import { getToken } from 'next-auth/jwt';
import nextAuthMiddleware, { NextRequestWithAuth } from 'next-auth/middleware';

const FREE_ACCESS_PAGES = [
  '/',
  '/log-in',
  '/getting-started',
  '/about*',
  '/images*',
  '/api/marketing',
];

/* Don't allow arbitrary regex to avoid accidentally leaking protected pages
Only two patterns allowed, exact match or /path* which matches the path
and all sub-routes
*/
function isFreeAccessRoute(requestUrl: string) {
  return FREE_ACCESS_PAGES.some((p) => {
    if (p.endsWith('*')) {
      // Remove the trailing '*' to get the base path
      const basePath = p.slice(0, -1);
      // Matches basePath or all subroutes
      return requestUrl === basePath || requestUrl.startsWith(basePath + '/'); //eslint-disable-line
    }
    return p === requestUrl;
  });
}

export async function middleware(request: NextRequest) {
  const session = await getToken<false, { accessTokenExpires: number }>({ req: request });
  const sessionValid = session && Date.now() < session.accessTokenExpires;
  const requestUrl = request.nextUrl.pathname;
  const { device } = userAgent(request);

  if (device.type === 'mobile') {
    const allowedPathsRegex = /^\/_next\/(static|image)|^\/api|^\/images/;
    // If the URL matches the allowed paths, proceed to the next middleware or handler (for assets and static files)
    if (allowedPathsRegex.test(requestUrl)) {
      return NextResponse.next();
    }
    // Redirect to /about for any other url
    if (!requestUrl.startsWith('/about')) {
      const url = request.nextUrl.clone();
      url.pathname = '/about';
      url.searchParams.set('warning', 'yes');
      return NextResponse.redirect(url);
    }
  }

  // If the user is authenticated and wants to access the home page or log-in page
  // then redirect to the main page
  if (sessionValid && (requestUrl === '/' || requestUrl === '/log-in')) {
    const url = request.nextUrl.clone();
    url.pathname = `/virtual-lab`;
    return NextResponse.redirect(url);
  }

  // Let them through if they're trying to access a public page
  if (isFreeAccessRoute(requestUrl)) {
    return NextResponse.next();
  }

  // If not authenticated redirect to Keycloak's login and if successful back to the originally requested page
  // Otherwise let them through
  return nextAuthMiddleware(request as NextRequestWithAuth);
}
