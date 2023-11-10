import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request });
  if (session) {
    const url = request.nextUrl.clone();
    url.pathname = '/main';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: '/',
};
