import { DefaultSession } from 'next-auth';
import { JWT, GetTokenParams } from 'next-auth/jwt';

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
  /* Extend the type of getToken to optionally take
extra properties for JWT */
  declare function getToken<R extends boolean = false, E = any>(
    params: GetTokenParams<R>
  ): Promise<R extends true ? string : (JWT & E) | null>;
}
