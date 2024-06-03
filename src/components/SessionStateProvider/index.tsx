'use client';

import { ReactNode, ReactElement } from 'react';

import useSessionState from '@/hooks/session';

type SessionStateWrapperProps = {
  children: ReactNode;
};

export default function SessionStateProvider({ children }: SessionStateWrapperProps) {
  useSessionState();

  return children as ReactElement;
}
