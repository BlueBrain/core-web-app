'use client';

import { useAtomValue } from 'jotai';
import { LabDetailBanner } from '../VirtualLabBanner';
import WelcomeUserBanner from './WelcomeUserBanner';
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
    </>
  );
}
