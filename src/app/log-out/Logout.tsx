'use client';

import { signOut } from 'next-auth/react';

import { basePath, isServer } from '@/config';

export default function Logout() {
  // Prevent window ref errors during SSR
  if (!isServer) signOut({ callbackUrl: `${basePath}/` });

  return 'Logging out...';
}
