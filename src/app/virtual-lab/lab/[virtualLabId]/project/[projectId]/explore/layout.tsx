'use client';

import { ReactNode, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSetAtom } from 'jotai/index';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import { sectionAtom } from '@/state/application';

type GenericLayoutProps = {
  children: ReactNode;
};

export default function ExploreLayout({ children }: GenericLayoutProps) {
  const setSection = useSetAtom(sectionAtom);

  useEffect(() => setSection('explore'), [setSection]);

  return <ErrorBoundary FallbackComponent={SimpleErrorComponent}>{children}</ErrorBoundary>;
}
