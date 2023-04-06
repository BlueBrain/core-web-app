'use client';

import { Params, Visualization } from '@/components/experiment-designer/sensory-input';

export default function SensoryInputPage() {
  return (
    <div className="columns-2 h-full">
      <Params />
      <Visualization />
    </div>
  );
}
