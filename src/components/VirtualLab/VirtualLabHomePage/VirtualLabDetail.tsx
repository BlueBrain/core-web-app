'use client';

import { useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { LabDetailBanner, detailAtom } from '../VirtualLabBanner';
import WelcomeUserBanner from './WelcomeUserBanner';
import BudgetPanel from './BudgetPanel';
import { VirtualLab } from '@/types/virtual-lab/lab';

export default function VirtualLabDetail({ lab }: { lab?: VirtualLab }) {
  useHydrateAtoms([[detailAtom, lab ?? null]], { dangerouslyForceHydrate: true });

  const virtualLabDetail = useAtomValue(detailAtom);

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
