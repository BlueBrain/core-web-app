'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ArrowLeftOutlined } from '@ant-design/icons';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import Link from '@/components/Link';

type Props = {
  children: ReactNode;
};

export default function BrainConfigSelectorLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex bg-primary-9 text-white p-8 gap-20">
      <div className="flex flex-col">
        <span className="text-4xl font-bold">New</span>
        <span className="text-2xl">Simulation Campaign</span>
        <Link
          href="/simulate"
          className="flex items-center justify-around text-primary-3 border border-primary-3 h-12 mt-6"
        >
          <ArrowLeftOutlined />
          Back Simulate Home
        </Link>
      </div>

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="grow">{children}</div>
      </ErrorBoundary>
    </div>
  );
}
