'use client';

import { ReactNode } from 'react';
import ExploreListingLayout from '@/components/explore-section/ExploreListingLayout';

export default function VirtualLabExperimentLayout({ children }: { children: ReactNode }) {
  return <ExploreListingLayout>{children}</ExploreListingLayout>;
}
