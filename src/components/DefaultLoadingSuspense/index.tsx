'use client';

import { ReactNode, Suspense } from 'react';

import { LoadingOutlined } from '@ant-design/icons';

type Props = {
  children: ReactNode;
};

function Loading() {
  return (
    <div className="bg-primary-8 h-screen w-[40px] text-neutral-1 text-3xl flex justify-center items-center">
      <LoadingOutlined />
    </div>
  );
}

export default function DefaultLoadingSuspense({ children }: Props) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
