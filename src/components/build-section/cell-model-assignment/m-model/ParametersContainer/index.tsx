'use client';

import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { useMemo } from 'react';

import { paramsToDisplay } from './constants';
import ParameterItem from './ParamItem';
import { mModelConfigAtom } from '@/state/brain-model-config/cell-model-assignment';
import { RequiredParamRawNames } from '@/types/m-model';
import { SettingsIcon } from '@/components/icons';

const loadableMModelConfigAtom = loadable(mModelConfigAtom);

type Props = {
  className?: string;
};

export default function ParametersContainer({ className }: Props) {
  const mModelConfigLoadable = useAtomValue(loadableMModelConfigAtom);
  const mModelConfig = mModelConfigLoadable.state === 'hasData' ? mModelConfigLoadable.data : null;

  const body = useMemo(() => {
    if (mModelConfigLoadable.state === 'loading') {
      return <div>Loading...</div>;
    }

    if (!mModelConfig) {
      return <div>No params were found</div>;
    }

    if (mModelConfig) {
      const paramRawNames = Object.keys(paramsToDisplay) as RequiredParamRawNames[];
      return (
        <div className="flex flex-col gap-y-8">
          {paramRawNames.map((paramRawName) => (
            <ParameterItem key={paramRawName} paramRawName={paramRawName} config={mModelConfig} />
          ))}
        </div>
      );
    }

    return null;
  }, [mModelConfigLoadable.state, mModelConfig]);

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
