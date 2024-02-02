'use client';

import { ReactNode, Suspense } from 'react';

import { LoadingOutlined } from '@ant-design/icons';

type Props = {
  children: ReactNode;
};

function Loading() {
  return (
    <div className="flex h-screen w-[40px] items-center justify-center bg-primary-8 text-3xl text-neutral-1">
      <LoadingOutlined />
    </div>
  );
}

export default function DefaultLoadingSuspense({ children }: Props) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
