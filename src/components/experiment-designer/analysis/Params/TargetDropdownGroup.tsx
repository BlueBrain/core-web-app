import { PrimitiveAtom, useAtomValue } from 'jotai';

import type {
  ExpDesignerParam,
  ExpDesignerTargetDropdownGroupParameter,
} from '@/types/experiment-designer';
import { MultiTargetDropdown } from '@/components/experiment-designer';
import { subheaderStyle } from '@/components/experiment-designer/GenericParamWrapper';

type Props = {
  paramAtom: PrimitiveAtom<ExpDesignerParam>;
  className?: string;
};

export default function TargetDropdownGroup({ paramAtom, className }: Props) {
  const paramAtomTyped = paramAtom as PrimitiveAtom<ExpDesignerTargetDropdownGroupParameter>;
  const data = useAtomValue(paramAtomTyped);

  return (
    <>
      <div className={subheaderStyle}>{data.name}</div>

      <MultiTargetDropdown
        paramAtom={paramAtomTyped}
        className={className}
        showSwitcher={false}
        showTitle={false}
      />
    </>
  );
}
