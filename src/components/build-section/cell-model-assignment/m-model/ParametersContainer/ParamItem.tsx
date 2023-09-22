import { useAtomValue, useSetAtom } from 'jotai';
import set from 'lodash/set';

import NumberParam from './NumberParam';
import StepSizeParam from './StepSizeParam';
import {
  mModelLocalParamsAtom,
  mModelNeuriteTypeSelectedAtom,
} from '@/state/brain-model-config/cell-model-assignment/m-model';
import {
  RequiredParamRawNames,
  ParamInfo,
  StepSizeInterface,
  OrientationInterface,
} from '@/types/m-model';
import { setMorphologyAssignmentConfigPayloadAtom } from '@/state/brain-model-config/cell-model-assignment/m-model/setters';
import { paramsToDisplay } from '@/constants/cell-model-assignment/m-model';
import { isConfigEditableAtom } from '@/state/brain-model-config';

type ParameterProps = {
  paramRawName: RequiredParamRawNames;
  paramValue: number | StepSizeInterface | OrientationInterface[];
};

export default function ParameterItem({ paramRawName, paramValue }: ParameterProps) {
  const setMModelOverrides = useSetAtom(mModelLocalParamsAtom);
  const setMorphAssConfigPayload = useSetAtom(setMorphologyAssignmentConfigPayloadAtom);
  const neuriteTypeSelected = useAtomValue(mModelNeuriteTypeSelectedAtom);
  const isConfigEditable = useAtomValue(isConfigEditableAtom);

  const paramInfo = paramsToDisplay[paramRawName];

  const setParamValue = (newValue: unknown) => {
    setMModelOverrides((oldAtomData) => {
      const cloned = structuredClone(oldAtomData);
      set(cloned, `${neuriteTypeSelected}.${paramRawName}`, newValue);
      return cloned;
    });
    setMorphAssConfigPayload();
  };

  const onNumberChange = (newValue: number) => {
    setParamValue(newValue);
  };

  const onStepSizeChange = (newValue: StepSizeInterface) => {
    setParamValue(newValue);
  };

  let component;
  switch (paramInfo.displayName) {
    case 'Randomness':
    case 'Targeting':
      component = (
        <NumberParam
          paramValue={paramValue as number}
          paramInfo={paramInfo as ParamInfo}
          onChange={onNumberChange}
          isConfigEditable={isConfigEditable}
        />
      );
      break;

    case 'Step size':
      component = (
        <StepSizeParam
          paramValue={paramValue as StepSizeInterface}
          paramInfo={paramInfo as ParamInfo}
          onChange={onStepSizeChange}
          isConfigEditable={isConfigEditable}
        />
      );
      break;

    default:
      component = <div>Parameter {paramInfo.displayName} not supported yet.</div>;
      break;
  }

  return component;
}
