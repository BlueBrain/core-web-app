import { DragOutlined, ExpandOutlined } from '@ant-design/icons';
import { ModeSwitchType } from '@/types/connectome-definition';
import { classNames } from '@/util/utils';

const modesArray: ModeSwitchType[] = ['Move', 'Select'];
const baseClasses = 'rounded-lg text-white flex items-center px-4 py-2 gap-2.5';

export default function ModeSwitch() {
  return (
    <>
      <button className={classNames(baseClasses, 'bg-slate-700 font-semibold')} type="button">
        <DragOutlined />
        {modesArray[0]}
      </button>
      <button className={baseClasses} type="button">
        <ExpandOutlined />
        {modesArray[1]}
      </button>
    </>
  );
}
