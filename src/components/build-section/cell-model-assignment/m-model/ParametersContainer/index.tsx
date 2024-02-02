'use client';

import { useAtomValue } from 'jotai';

import NeuriteTypeDropdown from './NeuriteTypeDropdown';
import ParametersWrapper from './ParametersWrapper';
import { SettingsIcon } from '@/components/icons';
import { mModelRemoteParamsLoadedAtom } from '@/state/brain-model-config/cell-model-assignment/m-model';

type Props = {
  className?: string;
};

export default function ParametersContainer({ className }: Props) {
  const remoteWasFetched = useAtomValue(mModelRemoteParamsLoadedAtom);
  const body = remoteWasFetched ? (
    <div className="flex flex-col gap-y-8">
      <span>You are modifying the m-model based on this neurite type</span>
      <NeuriteTypeDropdown />
      <ParametersWrapper />
    </div>
  ) : (
    <div>Loading...</div>
  );

  return (
    <div className={className}>
      <div className="text-xl font-bold text-primary-8">
        <SettingsIcon className="mr-2 inline-block h-4" />
        <span>Parameters</span>
      </div>
      <div className="mt-6 w-[200px] text-primary-8">{body}</div>
    </div>
  );
}
