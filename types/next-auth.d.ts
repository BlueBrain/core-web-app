import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      username: string;
    } & DefaultSession['user'];
    accessToken: string;
    error?: string;
  }
}
