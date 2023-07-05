import { useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import set from 'lodash/set';

import NumberParam from './NumberParam';
import { mockNeuriteType, paramsToDisplay } from './constants';
import { mModelPreviewConfigAtom } from '@/state/brain-model-config/cell-model-assignment/m-model';
import { ParamConfig, RequiredParamRawNames } from '@/types/m-model';

type ParameterProps = {
  paramRawName: RequiredParamRawNames;
  config: ParamConfig;
};

export default function ParameterItem({ paramRawName, config }: ParameterProps) {
  const [paramValue, setParamValue] = useState<number | null>();
  const setMModelPreviewConfig = useSetAtom(mModelPreviewConfigAtom);

  useEffect(() => {
    const requiredParamValues = config[mockNeuriteType];
    if (!requiredParamValues || !Object.keys(requiredParamValues).length) return;

    const value = requiredParamValues[paramRawName];
    if (typeof value !== 'number') return;
    setParamValue(value ?? null);
  }, [config, paramRawName]);

  const onNumberChange = (newValue: number) => {
    setParamValue(newValue);
    setMModelPreviewConfig((oldAtomValue) => {
      set(oldAtomValue, `overrides.${mockNeuriteType}.${paramRawName}`, newValue);
      return { ...oldAtomValue };
    });
  };

  const paramInfo = paramsToDisplay[paramRawName];

  if (typeof paramValue !== 'number') {
    return <div>Parameter type not supported</div>;
  }

  return <NumberParam paramValue={paramValue} paramInfo={paramInfo} onChange={onNumberChange} />;
}
