'use client';

import { ReactNode, ReactElement } from 'react';

import useSessionState, { SessionOrNull } from '@/hooks/session';

type SessionStateWrapperProps = {
  children: ReactNode;
  session: SessionOrNull
};

export default function SessionStateProvider({ children, session }: SessionStateWrapperProps) {
  useSessionState(session);

  return children as ReactElement;
}
