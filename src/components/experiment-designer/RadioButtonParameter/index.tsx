import { ExpDesignerRadioBtnParameter } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';
import { subheaderStyle, generateId } from '@/components/experiment-designer/GenericParamWrapper';

type Props = {
  data: ExpDesignerRadioBtnParameter;
  className?: string;
};

export default function RadioButtonParameter({ data, className }: Props) {
  return (
    <>
      <div className={subheaderStyle}>{data.name}</div>
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
