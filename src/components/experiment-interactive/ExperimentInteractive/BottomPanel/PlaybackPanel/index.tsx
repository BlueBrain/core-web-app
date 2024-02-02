'use client';

import PlaybackSpeed from './PlaybackSpeed';
import StepNavigator from './StepNavigator';
import StepSize from './StepSize';
import { Timeline } from './Timeline';
import { usePlayback } from './play-back';
import IconPause from '@/components/icons/Pause';
import IconPlay from '@/components/icons/Play';

export default function PlaybackPanel() {
  const [play, togglePlay] = usePlayback();
  return (
    <div className="flex w-full flex-row items-stretch gap-10 p-5">
      <Timeline disabled={play} />
      <div className="text-5xl">
        <button type="button" onClick={togglePlay}>
          {play ? <IconPause /> : <IconPlay />}
        </button>
      </div>
      <PlaybackSpeed />
      <div className="flex-0 flex flex-col justify-between">
        <StepSize />
        <StepNavigator />
      </div>
    </div>
  );
}
