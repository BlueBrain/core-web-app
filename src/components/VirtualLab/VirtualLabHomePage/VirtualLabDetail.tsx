'use client';

import { useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { LabDetailBanner, detailAtom } from '../VirtualLabBanner';
import WelcomeUserBanner from './WelcomeUserBanner';
import BudgetPanel from './BudgetPanel';
import { VirtualLab } from '@/types/virtual-lab/lab';

export function VirtualLabDetailSkeleton() {
  return (
    <>
      <div className="mt-10">
        <LabDetailBanner />
      </div>
      <BudgetPanel totalSpent={300} remaining={350} suspended />
    </>
  );
}

export default function VirtualLabDetail({ lab }: { lab: VirtualLab }) {
  useHydrateAtoms([[detailAtom, lab]]);

  const virtualLabDetail = useAtomValue(detailAtom);

  return (
    <>
      <WelcomeUserBanner />
      <div className="mt-10">
        <LabDetailBanner />
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
