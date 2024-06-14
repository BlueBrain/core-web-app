'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ArrowLeftOutlined } from '@ant-design/icons';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import GenericButton from '@/components/Global/GenericButton';

type Props = {
  children: ReactNode;
};

export default function BrainConfigSelectorLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen gap-20 bg-primary-9 p-8 text-white">
      <div className="flex flex-col">
        <span className="text-4xl font-bold">New</span>
        <span className="text-2xl">Simulation Campaign</span>
        <GenericButton
          className="mt-6 flex items-center justify-around border border-primary-3 text-primary-3"
          text={
            <>
              <ArrowLeftOutlined />
              Back to Main
            </>
          }
          href="/main"
        />
      </div>

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="grow">{children}</div>
      </ErrorBoundary>
    </div>
  );
}
