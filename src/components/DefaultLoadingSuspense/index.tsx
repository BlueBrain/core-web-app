'use client';

import { ReactNode, Suspense } from 'react';

import { LoadingOutlined } from '@ant-design/icons';

type Props = {
  children: ReactNode;
};

function Loading() {
  return (
    <div className="flex items-center justify-center text-3xl text-neutral-1">
      <LoadingOutlined />
    </div>
  );
}

export default function DefaultLoadingSuspense({ children }: Props) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
