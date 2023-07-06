'use client';

import { paramsToDisplay } from './constants';
import ParameterItem from './ParamItem';
import { RequiredParamRawNames } from '@/types/m-model';
import { SettingsIcon } from '@/components/icons';
import { useFetchMModelConfig } from '@/hooks/m-model-editor';

type Props = {
  className?: string;
};

export default function ParametersContainer({ className }: Props) {
  useFetchMModelConfig();

  const paramRawNames = Object.keys(paramsToDisplay) as RequiredParamRawNames[];
  const body = (
    <div className="flex flex-col gap-y-8">
      {paramRawNames.map((paramRawName) => (
        <ParameterItem key={paramRawName} paramRawName={paramRawName} />
      ))}
    </div>
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
