import { DefaultSession } from 'next-auth';
import { GetTokenParams } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      username: string;
    } & DefaultSession['user'];
    accessToken: string;
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  /* Override type of getToken to return Token instead of JWT
  Allow user to specify extra properties through E.
  Next-auth's JWT is not typesafe since it extends Record<string, unknown>  which
  allows for any property to exist in JWT */
  function getToken<R extends boolean = false, E = any>(
    params: GetTokenParams<R>
  ): Promise<R extends true ? string : (Token & E) | null>;

  interface Token {
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    sub?: string;
  }
}
