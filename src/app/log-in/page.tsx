'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { basePath, isServer } from '@/config';

export default function Page() {
  const searchParams = useSearchParams();
  const redirectURL = searchParams.get('callbackUrl');
  if (!isServer) signIn('keycloak', { callbackUrl: redirectURL || basePath });

  return null;
}
