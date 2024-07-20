'use client';

import { useSearchParams } from 'next/navigation';
import { basePath, isServer } from '@/config';
import { signIn } from '@/util/utils';

export default function Page() {
  const searchParams = useSearchParams();
  const redirectURL = searchParams.get('callbackUrl');
  if (!isServer) signIn( redirectURL ?? basePath);

  return 'Logging in...';
}
