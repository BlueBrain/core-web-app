import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import nextAuthMiddleware, { NextRequestWithAuth } from 'next-auth/middleware';

export async function middleware(request: NextRequest) {
  const session = (await getToken({ req: request })) as ReceivedSession | null;
  const sessionValid = session && Date.now() < session?.accessTokenExpires;
  const requestUrl = request.nextUrl.pathname;

  // If the user is authenticated and wants to access home page or log-in page
  // then redirect to the main page
  if (sessionValid && (requestUrl === '/' || requestUrl === '/log-in')) {
    const url = request.nextUrl.clone();
    url.pathname = `/main`;
    return NextResponse.redirect(url);
  }

  // Unathenticated user and wants to go to /log-in, let them through
  if (!sessionValid && requestUrl === '/log-in') {
    return NextResponse.next();
  }

  // If the user is not authenticated at all
  // then redirect them to the home/login page
  // if it's successful then redirect him to the origin request page
  if (!sessionValid && requestUrl !== '/') {
    return nextAuthMiddleware(request as NextRequestWithAuth);
  }
}

// TODO: Fix the types in auth.ts it's impossible to know that getToken returns
// had to define what it actually recieves for now. Also make sure it doesn't return the
// nested user data as it's repeated
type ReceivedSession = {
  name: string;
  email: string;
  sub: string;
  accessToken: string;
  accessTokenExpires: number;
  refreshToken: string;
  user: {
    name: string;
    email: string;
    id: string;
  };
  iat: number;
  exp: number;
  jti: string;
};
