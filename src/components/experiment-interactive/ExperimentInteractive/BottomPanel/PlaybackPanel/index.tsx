'use client';

import { Timeline } from './Timeline';
import StepNavigator from './StepNavigator';
import StepSize from './StepSize';
import { usePlayback } from './play-back';
import IconPlay from '@/components/icons/Play';
import IconPause from '@/components/icons/Pause';

export default function PlaybackPanel() {
  const [play, togglePlay] = usePlayback();
  return (
    <div className="w-full p-5 flex flex-row gap-10">
      <Timeline disabled={play} />
      <div className="h-full text-3xl">
        <button type="button" onClick={togglePlay}>
          {play ? <IconPause /> : <IconPlay />}
        </button>
      </div>
      <div className="w-4/12 h-full flex flex-row items-center gap-10">
        <StepNavigator />
        <StepSize />
      </div>
    </div>
  );
}
