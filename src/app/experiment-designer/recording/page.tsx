'use client';

import { Params, Visualization } from '@/components/experiment-designer/recording';

export default function RecordingPage() {
  return (
    <div className="columns-2 h-full">
      <Params />
      <Visualization />
    </div>
  );
}
