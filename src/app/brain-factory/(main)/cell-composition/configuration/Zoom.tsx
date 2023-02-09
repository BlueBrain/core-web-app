import { Slider } from 'antd';
import { ZoomInIcon, ZoomOutIcon } from '@/components/icons';

export default function ZoomControl({
  onChange,
  zoom,
}: {
  onChange: (value: number) => void;
  zoom: number;
}) {
  return (
    <div className="flex gap-2 items-center w-[200px] justify-self-end">
      <ZoomOutIcon className="h-[14px]" />
      <Slider
        className="grow"
        defaultValue={1}
        max={10}
        min={1}
        onChange={onChange}
        tooltip={{
          formatter: (value) => value && `${value * 100} %`,
          placement: 'top',
        }}
        handleStyle={{ borderColor: 'red' }}
        trackStyle={{ background: '#003A8C' }}
        value={zoom}
      />
      <ZoomInIcon className="h-[14px]" />
    </div>
  );
}
