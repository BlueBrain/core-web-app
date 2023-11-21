import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request });
  const sessionValid = session?.user && session?.accessToken;
  const requestUrl = request.nextUrl.pathname;

  // if the user is the authenticated and want to access home page
  // then redirect him to the main page
  if (sessionValid && requestUrl === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/main';
    return NextResponse.redirect(url);
  }
  // if the user is not authenticated at all
  // then redirect him to the home/login page
  // if it's successfull then redirect him to the origin request page
  if (!sessionValid && requestUrl !== '/') {
    const url = request.nextUrl.clone();
    if (requestUrl) url.searchParams.append('origin', encodeURIComponent(requestUrl));
    url.pathname = '/';

    return NextResponse.redirect(url);
  }
}

// NOTE: use middelware to redirect only when the user want to access membership pages
// any new page that need user auth data need to be added to this matcher
export const config = {
  matcher: [
    '/',
    '/main',
    '/(explore|build|simulate|simulations|main|experiment-designer|svc|virtual-lab)/(.*)',
  ],
};
