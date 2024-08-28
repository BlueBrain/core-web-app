import { Fragment, useRef } from 'react';

import { NeuronSegementInfo } from '@/services/bluenaas-single-cell/renderer-utils';

const dataMapping = {
  segIdx: 'Segment index',
  section: 'Section',
  section_nseg: 'Number of segments',
  offset: 'Offset',
  distance_from_soma: 'Distance from soma',
};

export default function NeuronMeshInjectionRecordingPopover({
  show,
  x,
  y,
  data,
}: {
  show: boolean;
  x: number;
  y: number;
  data: NeuronSegementInfo;
}) {
  const ref = useRef<HTMLDivElement>(null);

  if (!show) return;
  return (
    <div
      ref={ref}
      className="fixed max-w-max border border-zinc-600 bg-black p-4 text-white opacity-70 shadow-lg backdrop-blur-sm"
      style={{
        left: x - 113, // 113 is half of the container
        top: y + 8,
      }}
    >
      <div className="grid w-full grid-cols-[1fr_max-content] gap-x-5 gap-y-1">
        {Object.keys(data).map((o) => (
          <Fragment key={o}>
            <div className="font-light">{dataMapping[o as keyof typeof dataMapping]}</div>
            <div className="font-bold">{data[o]}</div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
