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
      <div className="font-bold text-xl text-primary-8">
        <SettingsIcon className="h-4 inline-block mr-2" />
        <span>Parameters</span>
      </div>
      <div className="w-[200px] text-primary-8 mt-6">{body}</div>
    </div>
  );
}
