import { MouseEventHandler } from 'react';
import { Button, Slider } from 'antd';
import { ZoomInIcon, ZoomOutIcon } from '@/components/icons';

export default function ZoomControl({
  onChange,
  zoom,
  reset,
}: {
  onChange: (value: number) => void;
  zoom: number;
  reset: MouseEventHandler<HTMLAnchorElement> & MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <div className="flex w-[300px] items-center gap-2 justify-self-end">
      <ZoomOutIcon className="h-[14px] text-primary-8" />
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
      <ZoomInIcon className="h-[14px] text-primary-8" />
      <Button onClick={reset} type="link" style={{ color: '#003A8C' }}>
        Reset
      </Button>
    </div>
  );
}
