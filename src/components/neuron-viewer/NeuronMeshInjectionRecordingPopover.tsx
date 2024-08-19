import { useRef } from 'react';
import { Button, Divider } from 'antd';

import { useRecordingSourceForSimulation } from '@/state/simulate/categories';
import { classNames } from '@/util/utils';
import useOnClickOutside from '@/hooks/useOnClickOutside';

export default function NeuronMeshInjectionRecordingPopover({
  show,
  data: { section, segmentOffset, x, y },
  onClose,
}: {
  show: boolean;
  data: {
    x: number;
    y: number;
    section: string;
    segmentOffset: number;
  };
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { add } = useRecordingSourceForSimulation();

  // TODO: add multiple injecton to the config
  const onInject = () => {
    onClose();
  };

  const onRecord = () => {
    add({ section, segmentOffset });
    onClose();
  };

  useOnClickOutside(ref, onClose);

  if (!show) return;
  return (
    <div
      ref={ref}
      className={classNames(
        'fixed rounded bg-white shadow-md',
        "z-0 after:absolute after:-top-1 after:left-1/2 after:h-0 after:w-0 after:-translate-x-1/2 after:rotate-45 after:border-4 after:border-white after:content-['']"
      )}
      style={{
        left: x - 113, // 113 is half of the container
        top: y + 8,
      }}
    >
      <Button onClick={onInject} className="z-10 w-32 rounded-none" type="text">
        Add injection
      </Button>
      <Divider orientation="center" type="vertical" className="mx-0" />
      <Button onClick={onRecord} className="z-10 w-32 rounded-none" type="text">
        Add recording
      </Button>
    </div>
  );
}
