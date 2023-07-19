import { useAtomValue } from 'jotai';

import ParameterItem from './ParamItem';
import { paramsToDisplay } from '@/constants/cell-model-assignment/m-model';
import { RequiredParamRawNames } from '@/types/m-model';
import { getMModelLocalOverridesAtom } from '@/state/brain-model-config/cell-model-assignment';
import { mModelNeuriteTypeSelectedAtom } from '@/state/brain-model-config/cell-model-assignment/m-model';

type Props = {
  className?: string;
};

export default function ParametersWrapper({ className }: Props) {
  const mModelLocalOverrides = useAtomValue(getMModelLocalOverridesAtom);
  const neuriteTypeSelected = useAtomValue(mModelNeuriteTypeSelectedAtom);

  const requiredParamValues = mModelLocalOverrides?.[neuriteTypeSelected];
  const emptyParams = !requiredParamValues || !Object.keys(requiredParamValues).length;

  const paramRawNames = Object.keys(paramsToDisplay) as RequiredParamRawNames[];
  return (
    <div className={className}>
      {emptyParams && <div>No params exist for {neuriteTypeSelected}</div>}
      {!emptyParams &&
        paramRawNames.map((paramRawName) => {
          const paramValue = requiredParamValues[paramRawName];
          return (
            <ParameterItem key={paramRawName} paramRawName={paramRawName} paramValue={paramValue} />
          );
        })}
    </div>
  );
}
