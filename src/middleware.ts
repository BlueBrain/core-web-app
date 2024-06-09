import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import nextAuthMiddleware, { NextRequestWithAuth } from 'next-auth/middleware';

const FREE_ACCESS_PAGES = ['/about'];

/* Don't allow arbitray regex to avoid accidentally leaking protected pages
only the listed pages and their nested pages are allowed */
function isFreeAccessRoute(requestUrl: string) {
  return FREE_ACCESS_PAGES.some((p) => {
    // Create a regular expression to match the exact path or path followed by a slash
    const regex = new RegExp(`^${p}(?:/|$)`);
    return regex.test(requestUrl);
  });
}

export async function middleware(request: NextRequest) {
  const session = await getToken<false, { accesTokenExpires: number }>({ req: request });
  const sessionValid = session && Date.now() < session.accesTokenExpires;
  const requestUrl = request.nextUrl.pathname;

  // If the user is authenticated and wants to access the home page or log-in page
  // then redirect to the main page
  if (sessionValid && (requestUrl === '/' || requestUrl === '/log-in')) {
    const url = request.nextUrl.clone();
    url.pathname = `/main`;
    return NextResponse.redirect(url);
  }

  // Unathenticated user and wants to go to /log-in let them through
  if (!sessionValid && requestUrl === '/log-in') {
    return NextResponse.next();
  }

  if (isFreeAccessRoute(requestUrl)) {
    return NextResponse.next();
  }

  // If the user is not authenticated redirect them to the login page
  // if it's log in is successful then redirect them to the originally requested page
  if (!sessionValid && requestUrl !== '/') {
    return nextAuthMiddleware(request as NextRequestWithAuth);
  }
}
