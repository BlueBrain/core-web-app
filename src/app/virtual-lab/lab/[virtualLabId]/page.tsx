'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { LoadingOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import VirtualLabSettingsError from './error';
import { getVirtualLabAtom } from '@/state/virtual-lab/lab';
import VirtualLabSettingsComponent from '@/components/VirtualLab/VirtualLabSettingsComponent';

export default function VirtualLabSettingsPage() {
  const params = useParams();
  const { data: session } = useSession();

  const currentLabId = params?.virtualLabId;
  const currentLabAtom = useMemo(
    () => loadable(getVirtualLabAtom((currentLabId as string) ?? '')),
    [currentLabId]
  );
  const currentLab = useAtomValue(currentLabAtom);

  if (currentLab.state === 'loading') {
    return (
      <div className="h-full w-full m-auto flex justify-center">
        <LoadingOutlined />
      </div>
    );
  }

  if (currentLab.state === 'hasError') {
    return (
      <div className="h-full w-full m-auto flex justify-center items-center">
        <VirtualLabSettingsError message={`No lab with id ${currentLabId} found.`} />
      </div>
    );
  }

  return (
    <div className="ml-10 text-white">
      {currentLab.data && session ? (
        <VirtualLabSettingsComponent virtualLab={currentLab.data} user={session.user} />
      ) : (
        <VirtualLabSettingsError message={`No lab with id ${currentLabId} found.`} />
      )}
    </div>
  );
}
