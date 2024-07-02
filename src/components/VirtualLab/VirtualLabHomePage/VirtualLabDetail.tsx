'use client';

import { useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { LabDetailBanner } from '../VirtualLabBanner';
import WelcomeUserBanner from './WelcomeUserBanner';
import BudgetPanel from './BudgetPanel';
import { VirtualLab } from '@/types/virtual-lab/lab';
import { getAtom } from '@/state/state';

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
  const vlabAtom = getAtom<VirtualLab>('vlab');

  useHydrateAtoms([[vlabAtom, lab]]);

  const virtualLabDetail = useAtomValue(vlabAtom);

  return (
    <>
      <WelcomeUserBanner />
      <div className="mt-10">
        <LabDetailBanner />
      </div>
      <BudgetPanel total={virtualLabDetail?.budget} totalSpent={300} remaining={350} />
    </>
  );
}
