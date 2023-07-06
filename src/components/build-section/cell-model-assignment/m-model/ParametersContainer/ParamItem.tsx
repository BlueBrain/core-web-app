import { useAtom, useSetAtom } from 'jotai';
import { useMemo } from 'react';
import set from 'lodash/set';

import NumberParam from './NumberParam';
import { mockNeuriteType, paramsToDisplay } from './constants';
import {
  mModelPreviewConfigAtom,
  mModelLocalConfigAtom,
} from '@/state/brain-model-config/cell-model-assignment';
import { RequiredParamRawNames } from '@/types/m-model';

type ParameterProps = {
  paramRawName: RequiredParamRawNames;
};

export default function ParameterItem({ paramRawName }: ParameterProps) {
  const [mModelLocalConfig, setMModelLocalConfig] = useAtom(mModelLocalConfigAtom);
  const setMModelPreviewConfig = useSetAtom(mModelPreviewConfigAtom);

  const paramValue = useMemo(() => {
    if (!mModelLocalConfig) return null;

    const requiredParamValues = mModelLocalConfig[mockNeuriteType];
    if (!requiredParamValues || !Object.keys(requiredParamValues).length) return null;

    const value = requiredParamValues[paramRawName];
    return value;
  }, [mModelLocalConfig]);

  const setParamValue = (newValue: unknown) => {
    setMModelLocalConfig((oldConfigAtomValue) => {
      if (!oldConfigAtomValue) return null;

      const cloned = structuredClone(oldConfigAtomValue);
      set(cloned, `${mockNeuriteType}.${paramRawName}`, newValue);
      return cloned;
    });
  };

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
