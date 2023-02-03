'use client';

import { PropsWithChildren } from 'react';

import useAuth from '@/hooks/auth';

type AuthWrapperProps = {
  authRequired?: boolean;
};

export default function AuthWrapper({
  children,
  authRequired,
}: PropsWithChildren<AuthWrapperProps>) {
  useAuth(authRequired);

  return <div>{children}</div>;
}
