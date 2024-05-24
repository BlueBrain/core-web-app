import { useSession } from 'next-auth/react';

export function useAccessToken(): string | undefined {
  const { data: session } = useSession();
  return session?.accessToken;
}
