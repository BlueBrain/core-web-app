'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ArrowLeftOutlined } from '@ant-design/icons';

import useAuth from '@/hooks/auth';
import SimpleErrorComponent from '@/components/GenericErrorFallback';
import Link from '@/components/Link';

type Props = {
  children: ReactNode;
};

export default function SimulationCampaignSelectorLayout({ children }: Props) {
  useAuth(true);

  return (
    <div className="min-h-screen flex bg-primary-9 text-white p-8 gap-20">
      <div className="flex flex-col">
        <span className="text-4xl font-bold">SIMULATE</span>
        <span className="text-primary-3 mt-2">Explanation</span>
        <Link
          href="/"
          className="self-start flex items-center justify-between text-primary-3 border border-primary-3 h-12 mt-6 p-5"
        >
          <ArrowLeftOutlined />
          <span className="ml-4">Back home</span>
        </Link>

        <div className="text-l mt-10 text-primary-3 cursor-not-allowed">All</div>
        <div className="text-l mt-2">Recently created simulation campaigns</div>
        <div className="text-l mt-2 text-primary-3 cursor-not-allowed">My simulation campaigns</div>
      </div>

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="grow">{children}</div>
      </ErrorBoundary>
    </div>
  );
}
