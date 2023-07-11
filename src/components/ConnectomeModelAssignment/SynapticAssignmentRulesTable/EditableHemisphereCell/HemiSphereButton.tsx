import { classNames } from '@/util/utils';
import RightHemisphere from '@/components/icons/RightHemisphere';
import LeftHemisphere from '@/components/icons/LeftHemisphere';
import Style from './editable-hemisphere-cell.module.css';

export interface HemiSphereButtonProps {
  value: string | null;
  type: 'left' | 'right';
  onClick: (type: 'left' | 'right') => void;
}

export default function HemiSphereButton({ value, type, onClick }: HemiSphereButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(type)}
      className={classNames('bg-primary-6', value === type ? Style.selected : Style.unselected)}
    >
      {type === 'left' ? <LeftHemisphere /> : <RightHemisphere />}
    </button>
  );
}
