'use client';

import { ArrowRightOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';
import Link from '@/components/Link';

export default function ArticleListForExperimentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-y-hidden">
      <div className="bg-neutral-1 text-primary-8 w-10 h-full flex items-start justify-center">
        <Link
          className="whitespace-pre text-sm rotate-180 mt-5"
          href="/explore/interactive"
          style={{ writingMode: 'vertical-rl' }}
        >
          Back to explore interactive
          <ArrowRightOutlined className="mt-6" />
        </Link>
      </div>
      {children}
    </div>
  );
}
