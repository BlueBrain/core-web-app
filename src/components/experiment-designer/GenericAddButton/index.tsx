import { PlusCircleOutlined } from '@ant-design/icons';
import { classNames } from '@/util/utils';

type Props = {
  onClick: () => any;
  title: string;
  className?: string;
};

const btnStyle = 'px-[10px] py-[8px] flex gap-2 border-2 items-center m-[16px] text-primary-7';

export default function GenericAddButton({ onClick, className, title }: Props) {
  return (
    <button onClick={onClick} className={classNames(className, btnStyle)} type="button">
      <PlusCircleOutlined />
      {title}
    </button>
  );
}
