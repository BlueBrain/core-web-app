'use client';

import { PrimitiveAtom, useAtomValue } from 'jotai';

import type {
  ExpDesignerCheckboxParameter,
  ExpDesignerCheckboxGroupParameter,
} from '@/types/experiment-designer';
import { classNames } from '@/util/utils';
import { generateId } from '@/components/experiment-designer/GenericParamWrapper';

type Props = {
  paramAtom: PrimitiveAtom<ExpDesignerCheckboxGroupParameter>;
  className?: string;
};

function Checkboxes({ data }: { data: ExpDesignerCheckboxParameter[] }) {
  return (
    <>
      {data.map((checkboxItem: ExpDesignerCheckboxParameter) => {
        const id = generateId('lfp', checkboxItem.id);
        return (
          <div key={id} className="ml-3 flex items-center gap-2">
            <input type="checkbox" id={id} />
            <label htmlFor={id}>{checkboxItem.name}</label>
          </div>
        );
      })}
    </>
  );
}

export default function CheckboxGroup({ paramAtom, className }: Props) {
  const data = useAtomValue(paramAtom);

  return (
    <div className={classNames('flex gap-3', className)}>
      <div className="grow font-bold">{data.name}</div>
      <Checkboxes data={data.value} />
    </div>
  );
}
