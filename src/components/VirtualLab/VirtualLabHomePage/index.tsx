'use client';

import { LabDetailBanner } from '../VirtualLabBanner';
import WelcomeUserBanner from './WelcomeUserBanner';
import { useUnwrappedValue } from '@/hooks/hooks';
import { virtualLabDetailAtomFamily } from '@/state/virtual-lab/lab';

export default function VirtualLabHome({ id }: { id: string }) {
  const vlab = useUnwrappedValue(virtualLabDetailAtomFamily(id));
  return (
    <>
      <WelcomeUserBanner title={vlab?.name} />
      <div className="mt-10">
        <LabDetailBanner vlab={vlab ?? undefined} />
      </div>
    </>
  );
}
