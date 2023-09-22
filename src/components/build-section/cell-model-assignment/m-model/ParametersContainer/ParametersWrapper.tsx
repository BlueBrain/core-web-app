import { useAtomValue } from 'jotai';

import ParameterItem from './ParamItem';
import { paramsToDisplay } from '@/constants/cell-model-assignment/m-model';
import { RequiredParamRawNames } from '@/types/m-model';
import {
  mModelNeuriteTypeSelectedAtom,
  getMModelLocalParamsAtom,
} from '@/state/brain-model-config/cell-model-assignment/m-model';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';

type Props = {
  className?: string;
};

export default function ParametersWrapper({ className }: Props) {
  const mModelLocalOverrides = useAtomValue(getMModelLocalParamsAtom);
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
            <DefaultLoadingSuspense key={paramRawName}>
              <ParameterItem paramRawName={paramRawName} paramValue={paramValue} />
            </DefaultLoadingSuspense>
          );
        })}
    </div>
  );
}
