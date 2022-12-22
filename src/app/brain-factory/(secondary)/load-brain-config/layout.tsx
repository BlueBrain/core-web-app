'use client';

import { ReactNode } from 'react';

import useEnsureLogin from '@/hooks/ensure-login';

type GenericLayoutProps = {
  children: ReactNode;
};

export default function GenericLayout({ children }: GenericLayoutProps) {
  useEnsureLogin();
  return children;
}
