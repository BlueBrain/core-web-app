'use client';

import { Timeline } from './Timeline';
import StepNavigator from './StepNavigator';
import StepSize from './StepSize';

export default function PlaybackPanel() {
  return (
    <div className="w-full p-5 flex flex-row gap-10">
      <Timeline />

      <div className="w-4/12 h-full flex flex-row items-center h-5 gap-10">
        <StepNavigator />
        <StepSize />
      </div>
    </div>
  );
}
