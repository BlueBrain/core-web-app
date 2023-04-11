'use client';

import { ReactNode, ReactElement } from 'react';

import useSession from '@/hooks/session';

type SessionStateWrapperProps = {
  children: ReactNode;
};

export default function SessionStateProvider({ children }: SessionStateWrapperProps) {
  useSession();

  return children as ReactElement;
}
