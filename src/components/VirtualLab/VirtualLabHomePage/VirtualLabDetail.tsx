'use client';

import { LabDetailBanner } from '../VirtualLabBanner';
import WelcomeUserBanner from './WelcomeUserBanner';
import BudgetPanel from './BudgetPanel';
import { virtualLabDetailAtomFamily } from '@/state/virtual-lab/lab';
import { useUnwrappedValue } from '@/hooks/hooks';

export default function VirtualLabDetail({ id }: { id?: string }) {
  /* 
  Unwrap prevents flashing when transitioning from the pre-rendered
  content to the data downloaded by client caused by jotai re-triggering Suspense
  */
  const virtualLabDetail = useUnwrappedValue(virtualLabDetailAtomFamily(id));

  return (
    <>
      <WelcomeUserBanner title={virtualLabDetail?.name} />
      <div className="mt-10">
        <LabDetailBanner
          createdAt={virtualLabDetail?.created_at}
          description={virtualLabDetail?.description}
          id={virtualLabDetail?.id}
          name={virtualLabDetail?.name}
        />
      </div>
      <BudgetPanel
        total={virtualLabDetail?.budget}
        totalSpent={300}
        remaining={350}
        suspended={!virtualLabDetail}
      />
    </>
  );
}
