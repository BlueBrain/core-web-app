'use client';

import { Params, Visualization } from '@/components/experiment-designer/stimulation-protocol';

export default function StimulationProtocolPage() {
  return (
    <div className="columns-2 h-full">
      <Params />
      <Visualization />
    </div>
  );
}
