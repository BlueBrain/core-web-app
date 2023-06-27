'use client';

import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { useEffect, useMemo, useState } from 'react';
import { Slider } from 'antd';

import { mModelConfigAtom } from '@/state/brain-model-config/cell-model-assignment';
import { MModelParamConfig, NeuriteType, RequiredParamRawNames } from '@/types/m-model';
import { SettingsIcon } from '@/components/icons';

const loadableMModelConfigAtom = loadable(mModelConfigAtom);

const mockNeuriteType: NeuriteType = 'apical_dendrite';

type ParamsToDisplayInterface = {
  [key in RequiredParamRawNames]: { displayName: string };
};

const paramsToDisplay: ParamsToDisplayInterface = {
  randomness: { displayName: 'Randomness' },
  radius: { displayName: 'Radius' },
  step_size: { displayName: 'Step size' },
};

type ParameterProps = {
  paramRawName: RequiredParamRawNames;
  config: MModelParamConfig;
};

function ParameterComponent({ paramRawName, config }: ParameterProps) {
  const [paramValue, setParamValue] = useState<number | null>();

  useEffect(() => {
    const requiredParamValues = config[mockNeuriteType];
    if (!requiredParamValues || !Object.keys(requiredParamValues).length) return;

    const value = requiredParamValues[paramRawName];
    if (typeof value !== 'number') return;
    setParamValue(value ?? null);
  }, [config, paramRawName]);

  const name = paramsToDisplay[paramRawName].displayName;

  const onChange = (newValue: number) => {
    setParamValue(newValue);
  };

  const sanitize = (changedValue: any) => (typeof changedValue === 'number' ? changedValue : 0);

  if (typeof paramValue !== 'number') return null;

  return (
    <div>
      <div className="flex justify-between">
        <div>{name}</div>
        <input
          type="number"
          className="font-bold text-primary-8 w-[40px] text-end border rounded"
          value={sanitize(paramValue)}
          step={0.1}
          onChange={(e) => onChange(sanitize(e.target.valueAsNumber))}
        />
      </div>
      <Slider min={0} onChange={onChange} value={sanitize(paramValue)} />
    </div>
  );
}

export default function ParameterSliders() {
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
            <ParameterComponent
              key={paramRawName}
              paramRawName={paramRawName}
              config={mModelConfig}
            />
          ))}
        </div>
      );
    }

    return null;
  }, [mModelConfigLoadable.state, mModelConfig]);

  return (
    <>
      <div className="font-bold text-xl text-primary-8">
        <SettingsIcon className="h-4 inline-block mr-2" />
        <span>Parameters</span>
      </div>
      <div className="w-[200px] text-primary-8 mt-6">{body}</div>
    </>
  );
}
