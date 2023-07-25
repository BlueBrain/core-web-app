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
      <div className="flex flex-col w-[310px]">
        <span className="text-7xl font-bold">SIMULATE</span>
        <span className="text-primary-3 mt-2">
          Here is a description of what can be achieved in this app. What is expected from the user
          and what is the output...
        </span>
        <Link
          href="/"
          className="self-start flex items-center justify-between text-primary-3 border border-primary-3 h-12 mt-6 p-5"
        >
          <ArrowLeftOutlined />
          <span className="ml-4">Back home</span>
        </Link>
      </div>

      <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
        <div className="grow">{children}</div>
      </ErrorBoundary>
    </div>
  );
}
