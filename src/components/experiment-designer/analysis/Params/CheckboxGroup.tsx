'use client';

import type {
  ExpDesignerCheckboxParameter,
  ExpDesignerCheckboxGroupParameter,
} from '@/types/experiment-designer';
import { classNames } from '@/util/utils';
import { generateId } from '@/components/experiment-designer/GenericParamWrapper';

type Props = {
  data: ExpDesignerCheckboxGroupParameter;
  className?: string;
};

function Checkboxes({ data }: { data: ExpDesignerCheckboxParameter[] }) {
  return (
    <>
      {data.map((checkboxItem: ExpDesignerCheckboxParameter) => {
        const id = generateId('lfp', checkboxItem.id);
        return (
          <div key={id} className="flex items-center gap-2 ml-3">
            <input type="checkbox" id={id} />
            <label htmlFor={id}>{checkboxItem.name}</label>
          </div>
        );
      })}
    </>
  );
}

export default function CheckboxGroup({ data, className }: Props) {
  return (
    <div className={classNames('flex gap-3', className)}>
      <div className="grow font-bold">{data.name}</div>
      <Checkboxes data={data.value} />
    </div>
  );
}
