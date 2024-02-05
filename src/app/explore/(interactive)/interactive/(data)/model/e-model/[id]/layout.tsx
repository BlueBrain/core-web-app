'use client';

import { ReactNode, Suspense } from 'react';
import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';
import Detail from '@/components/explore-section/Detail';
import SectionTabs from '@/components/explore-section/EModel/DetailView/SectionTabs';
import { E_MODEL_FIELDS } from '@/constants/explore-section/detail-views-fields';

export default function EModelLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<CentralLoadingSpinner />}>
      <Detail fields={E_MODEL_FIELDS}>
        {() => (
          <>
            <SectionTabs />
            <div className="-mt-7 h-max w-full flex-1 border border-primary-8">{children}</div>
          </>
        )}
      </Detail>
    </Suspense>
  );
}
