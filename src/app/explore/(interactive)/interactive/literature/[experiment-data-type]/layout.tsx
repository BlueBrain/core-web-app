'use client';

import { ReactNode } from 'react';

import BackToInteractiveExplorationBtn from '@/components/explore-section/BackToInteractiveExplorationBtn';

export default function ArticleListForExperimentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-y-hidden">
      <BackToInteractiveExplorationBtn prefetch={false} />
      {children}
    </div>
  );
}
