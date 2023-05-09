import { PrimitiveAtom, useAtom } from 'jotai';

import { ExpDesignerRadioBtnParameter } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';
import { subheaderStyle, generateId } from '@/components/experiment-designer/GenericParamWrapper';

type Props = {
  paramAtom: PrimitiveAtom<ExpDesignerRadioBtnParameter>;
  className?: string;
};

export default function RadioButtonParameter({ paramAtom, className }: Props) {
  const [data, setData] = useAtom(paramAtom);

  const change = (selectedOption: string) => {
    setData((oldAtomData) => ({
      ...oldAtomData,
      value: selectedOption,
    }));
  };

  return (
    <>
      <div className={subheaderStyle}>{data.name}</div>
      {data.options.map((option) => (
        <div className={classNames('flex gap-3', className)} key={option}>
          <label className="grow font-bold" htmlFor={generateId(data.name, option)}>
            {option}
          </label>
          <input
            type="radio"
            name={data.name}
            id={generateId(data.name, option)}
            onChange={() => change(option)}
            checked={option === data.value}
          />
        </div>
      ))}
    </>
  );
}
