import { useAtom, useSetAtom } from 'jotai';
import { useMemo } from 'react';
import set from 'lodash/set';

import NumberParam from './NumberParam';
import { mockNeuriteType, paramsToDisplay } from './constants';
import OrientationParam from './OrientationParam';
import StepSizeParam from './StepSizeParam';
import {
  mModelPreviewConfigAtom,
  mModelLocalConfigAtom,
} from '@/state/brain-model-config/cell-model-assignment';
import {
  RequiredParamRawNames,
  ParamInfo,
  OrientationToDisplay,
  OrientationInterface,
  StepSizeInterface,
} from '@/types/m-model';

type ParameterProps = {
  paramRawName: RequiredParamRawNames;
};

export default function ParameterItem({ paramRawName }: ParameterProps) {
  const [mModelLocalConfig, setMModelLocalConfig] = useAtom(mModelLocalConfigAtom);
  const setMModelPreviewConfig = useSetAtom(mModelPreviewConfigAtom);

  const paramInfo = paramsToDisplay[paramRawName];
  const paramValue = useMemo(() => {
    if (!mModelLocalConfig) return null;

    const requiredParamValues = mModelLocalConfig[mockNeuriteType];
    if (!requiredParamValues || !Object.keys(requiredParamValues).length) return null;

    const value = requiredParamValues[paramRawName];
    return value;
  }, [mModelLocalConfig, paramRawName]);

  const setParamValue = (newValue: unknown) => {
    setMModelLocalConfig((oldConfigAtomValue) => {
      if (!oldConfigAtomValue) return null;

      const cloned = structuredClone(oldConfigAtomValue);
      set(cloned, `${mockNeuriteType}.${paramRawName}`, newValue);
      return cloned;
    });
  };

  const setPreview = (newValue: number | OrientationInterface | StepSizeInterface) => {
    setMModelPreviewConfig((oldAtomValue) => {
      set(oldAtomValue, `overrides.${mockNeuriteType}.${paramRawName}`, newValue);
      return { ...oldAtomValue };
    });
  };

  const onNumberChange = (newValue: number) => {
    setParamValue(newValue);
    setPreview(newValue);
  };

  const onOrientationChange = (newValue: OrientationInterface) => {
    setParamValue([newValue]);
    setPreview(newValue);
  };

  const onStepSizeChange = (newValue: StepSizeInterface) => {
    setParamValue(newValue);
    setPreview(newValue);
  };

  let component;
  switch (paramInfo.displayName) {
    case 'Orientation':
      component = (
        <OrientationParam
          paramValue={(paramValue as OrientationInterface[])[0]}
          paramInfo={paramInfo as OrientationToDisplay}
          onChange={onOrientationChange}
        />
      );
      break;

    case 'Radius':
    case 'Randomness':
      component = (
        <NumberParam
          paramValue={paramValue as number}
          paramInfo={paramInfo as ParamInfo}
          onChange={onNumberChange}
        />
      );
      break;

    case 'Step size':
      component = (
        <StepSizeParam
          paramValue={paramValue as StepSizeInterface}
          paramInfo={paramInfo as ParamInfo}
          onChange={onStepSizeChange}
        />
      );
      break;

    default:
      component = <div>Parameter {paramInfo.displayName} not supported yet.</div>;
      break;
  }

  return component;
}
