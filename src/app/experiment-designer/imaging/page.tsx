'use client';

import { Params, Visualization } from '@/components/experiment-designer/imaging';

export default function ImagingPage() {
  return (
    <div className="columns-2 h-full">
      <Params />
      <Visualization />
    </div>
  );
}
