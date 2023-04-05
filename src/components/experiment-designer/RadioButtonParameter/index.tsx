import { ExpDesignerRadioBtnParameter } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';
import { defaultPadding } from '@/components/experiment-designer/GenericParamWrapper';

type Props = {
  data: ExpDesignerRadioBtnParameter;
  className?: string;
};

const titleStyle = `${defaultPadding} uppercase text-gray-400`;

const generateId = (param1: string, param2: string) =>
  `${param1.replaceAll(' ', '')}${param2.replaceAll(' ', '')}`;

export default function RadioButtonParameter({ data, className }: Props) {
  return (
    <>
      <div className={titleStyle}>{data.name}</div>
      {data.value.map((option) => (
        <div className={classNames('flex gap-3', className)} key={option}>
          <label className="grow font-bold" htmlFor={generateId(data.name, option)}>
            {option}
          </label>
          <input type="radio" name={data.name} id={generateId(data.name, option)} />
        </div>
      ))}
    </>
  );
}
