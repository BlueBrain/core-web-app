'use client';

import { useAtomValue } from 'jotai';
import { LabDetailBanner } from '../VirtualLabBanner';
import WelcomeUserBanner from './WelcomeUserBanner';
import BudgetPanel from './BudgetPanel';
import { virtualLabDetailAtomFamily } from '@/state/virtual-lab/lab';

export default function VirtualLabDetail({ id }: { id?: string }) {
  const virtualLabDetail = useAtomValue(virtualLabDetailAtomFamily(id));

  return (
    <>
      <WelcomeUserBanner title={virtualLabDetail?.name} />
      <div className="mt-10">
        <LabDetailBanner
          createdAt={virtualLabDetail?.created_at}
          description={virtualLabDetail?.description}
          id={id}
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
