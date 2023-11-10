'use client';

import { useEffect, useRef, useState } from 'react';

import { useCurrentSimulationReport } from '../../hooks/current-report';
import { usePlaybackSpeed } from '../../hooks/playback-speed';
import { useSimulationCurrentBiologicalTime } from '@/state/experiment-interactive';
import { MultiBraynsManagerInterface, useMultiBraynsManager } from '@/services/brayns/simulations';
import { SimulationReport } from '@/services/brayns/simulations/resource-manager/backend-service';

export function usePlayback(): [play: boolean, togglePlay: () => void] {
  const refSimulationStartTime = useRef(-1);
  const [play, setPlay] = useState(false);
  const report = useCurrentSimulationReport();
  const [time, setTime] = useSimulationCurrentBiologicalTime(report);
  const manager = useMultiBraynsManager();
  const [playbackSpeedItem] = usePlaybackSpeed();
  // Video duration in msec.
  const wholePlaybackTime = report ? (report.end - report.start) * playbackSpeedItem.factor : 1;
  // We want the playback to start from the current step.
  useEffect(() => {
    if (!play) {
      refSimulationStartTime.current = -1;
    } else if (report && refSimulationStartTime.current < 0) {
      refSimulationStartTime.current = wholePlaybackTime * (1 - time / (report.end - report.start));
    }
  }, [play, time, report, wholePlaybackTime]);

  usePlaybackAnimation(
    manager,
    report,
    play,
    wholePlaybackTime,
    refSimulationStartTime.current,
    setTime
  );

  return [
    play,
    () => {
      setPlay(!play);
    },
  ];
}

/**
 * Manage the requestAnimationFrame process.
 */
function usePlaybackAnimation(
  manager: MultiBraynsManagerInterface | null,
  report: SimulationReport | null | undefined,
  play: boolean,
  wholePlaybackTime: number,
  simulationStartTime: number,
  setTime: (time: number) => void
) {
  const refTime = useRef(0);
  const refRequestAnimationFrame = useRef(0);

  useEffect(() => {
    if (!manager || !report) return;

    if (!play) {
      window.cancelAnimationFrame(refRequestAnimationFrame.current);
      refTime.current = 0;
      return;
    }
    const playNextStep = (frameTime: number) => {
      refRequestAnimationFrame.current = window.requestAnimationFrame(playNextStep);
      if (refTime.current === 0) {
        refTime.current = frameTime;
      }
      const alpha =
        ((frameTime + wholePlaybackTime - simulationStartTime - refTime.current) %
          wholePlaybackTime) /
        wholePlaybackTime;
      const simulationTime = alpha * (report.end - report.start);
      const frameIndex = Math.floor(simulationTime / report.delta);
      setTime(simulationTime);
      manager.setSimulationFrame(frameIndex);
    };
    refRequestAnimationFrame.current = window.requestAnimationFrame(playNextStep);
    // eslint-disable-next-line consistent-return
    return () => {
      window.cancelAnimationFrame(refRequestAnimationFrame.current);
    };
  }, [play, manager, report, setTime, wholePlaybackTime, simulationStartTime]);
}
