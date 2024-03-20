'use client';

import { ReactNode } from 'react';
import ExploreListingLayout from '@/components/explore-section/ExploreListingLayout';

export default function ExploreInteractiveDataLayout({ children }: { children: ReactNode }) {
  return <ExploreListingLayout>{children}</ExploreListingLayout>;
}
