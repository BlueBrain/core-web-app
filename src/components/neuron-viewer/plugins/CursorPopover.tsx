import { Fragment, useRef } from 'react';

import { NeuronSegementInfo } from '@/services/bluenaas-single-cell/renderer-utils';

const dataMapping = {
  segIdx: { title: 'Segment index', unit: '' },
  section: { title: 'Section', unit: '' },
  section_nseg: { title: 'Number of segments', unit: '' },
  offset: { title: 'Offset', unit: '' },
  distance_from_soma: { title: 'Distance from soma', unit: 'µm' },
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
      className="fixed z-30 max-w-max border border-orange-400 bg-black p-4 text-white opacity-80 shadow-lg backdrop-blur-sm"
      style={{
        left: x - 113, // 113 is half of the container
        top: y + 8,
      }}
    >
      <div className="grid w-full grid-cols-[1fr_max-content] gap-x-5 gap-y-1">
        {Object.keys(data).map((o) => (
          <Fragment key={o}>
            <div className="font-light text-orange-400">
              {dataMapping[o as keyof typeof dataMapping].title}
            </div>
            <div className="font-bold">
              {data[o]} {dataMapping[o as keyof typeof dataMapping].unit}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
