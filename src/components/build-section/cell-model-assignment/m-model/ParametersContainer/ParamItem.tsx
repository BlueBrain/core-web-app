import { useAtomValue, useSetAtom } from 'jotai';
import { useMemo } from 'react';
import set from 'lodash/set';

import NumberParam from './NumberParam';
import OrientationParam from './OrientationParam';
import StepSizeParam from './StepSizeParam';
import {
  mModelPreviewConfigAtom,
  mModelOverridesAtom,
  getMModelLocalOverridesAtom,
} from '@/state/brain-model-config/cell-model-assignment';
import {
  RequiredParamRawNames,
  ParamInfo,
  OrientationToDisplay,
  OrientationInterface,
  StepSizeInterface,
  ParamConfig,
} from '@/types/m-model';
import { setMorphologyAssignmentConfigPayloadAtom } from '@/state/brain-model-config/cell-model-assignment/m-model/setters';
import { neuriteTypes, paramsToDisplay } from '@/constants/cell-model-assignment/m-model';

type ParameterProps = {
  paramRawName: RequiredParamRawNames;
};

export default function ParameterItem({ paramRawName }: ParameterProps) {
  const setMModelOverrides = useSetAtom(mModelOverridesAtom);
  const mModelLocalOverrides = useAtomValue(getMModelLocalOverridesAtom);
  const setMModelPreviewConfig = useSetAtom(mModelPreviewConfigAtom);
  const setMorphAssConfigPayload = useSetAtom(setMorphologyAssignmentConfigPayloadAtom);

  const paramInfo = paramsToDisplay[paramRawName];
  const paramValue = useMemo(() => {
    if (!mModelLocalOverrides) return null;
    if (!Object.keys(mModelLocalOverrides).length) return null;

    const requiredParamValues = (mModelLocalOverrides as ParamConfig)[neuriteTypes.apical_dendrite];
    if (!requiredParamValues || !Object.keys(requiredParamValues).length) return null;

    const value = requiredParamValues[paramRawName];
    return value;
  }, [mModelLocalOverrides, paramRawName]);

  const setParamValue = (newValue: unknown) => {
    setMModelOverrides((oldAtomData) => {
      const cloned = structuredClone(oldAtomData);
      set(cloned, `${neuriteTypes.apical_dendrite}.${paramRawName}`, newValue);
      set(cloned, `${neuriteTypes.basal_dendrite}.${paramRawName}`, newValue);
      return cloned;
    });
    setMorphAssConfigPayload();
  };

  const setPreview = (newValue: number | OrientationInterface | StepSizeInterface) => {
    setMModelPreviewConfig((oldAtomValue) => {
      set(oldAtomValue, `overrides.${neuriteTypes.apical_dendrite}.${paramRawName}`, newValue);
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
    case 'Targeting':
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
