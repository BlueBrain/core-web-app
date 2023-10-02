import { Slider } from 'antd';
import { classNames } from '@/util/utils';

interface HorizontalSliderProps {
  className?: string;
  color: string;
  max: number;
  step: number;
  onSliding?: ((value: number | null) => void) | undefined;
  onAfterSliding?: ((value: number | null) => void) | undefined;
  value?: number;
}

export default function HorizontalSlider({
  className,
  color,
  max,
  onSliding,
  onAfterSliding,
  value,
  step,
}: HorizontalSliderProps) {
  return (
    <div className={classNames('flex grow items-center justify-between w-full', className)}>
      <Slider
        className="grow"
        tooltip={{ open: false }}
        min={0}
        max={max}
        step={step}
        value={value}
        onChange={onSliding}
        onAfterChange={onAfterSliding}
        range={false}
        style={{ height: '8px' }}
        trackStyle={{ backgroundColor: color, width: '100%', height: '2px' }}
      />
    </div>
  );
}
