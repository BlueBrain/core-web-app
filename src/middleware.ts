import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import nextAuthMiddleware, { NextRequestWithAuth } from 'next-auth/middleware';

export async function middleware(request: NextRequest) {
  const session = (await getToken({ req: request })) as ReceivedSession | null;
  const sessionValid = session && Date.now() < session?.accessTokenExpires;
  const requestUrl = request.nextUrl.pathname;

  if (requestUrl === '/log-in') {
    return NextResponse.next();
  }

  // If the user is the authenticated and want to access home page
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
