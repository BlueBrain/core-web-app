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
    <div className="w-full p-5 flex flex-row gap-10 items-stretch">
      <Timeline disabled={play} />
      <div className="text-5xl">
        <button type="button" onClick={togglePlay}>
          {play ? <IconPause /> : <IconPlay />}
        </button>
      </div>
      <PlaybackSpeed />
      <div className="flex flex-col flex-0 justify-between">
        <StepSize />
        <StepNavigator />
      </div>
    </div>
  );
}
