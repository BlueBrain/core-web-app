'use client';

import { useEffect, useRef, useState } from 'react';

import { useCurrentSimulationReport } from '../../hooks/current-report';
import { useSimulationCurrentStep } from '@/state/experiment-interactive';
import { useMultiBraynsManager } from '@/services/brayns/simulations';

const wholePlaybackTime = 10000;
export function usePlayback(): [play: boolean, togglePlay: () => void] {
  const refTime = useRef(0);
  const refSimulationStartTime = useRef(-1);
  const refRequestAnimationFrame = useRef(0);
  const [play, setPlay] = useState(false);
  const report = useCurrentSimulationReport();
  const [step, setStep] = useSimulationCurrentStep(report);
  const manager = useMultiBraynsManager();
  /**
   * We want the playback to start from the current step.
   */
  useEffect(() => {
    if (!play) {
      refSimulationStartTime.current = -1;
    } else if (report && refSimulationStartTime.current < 0) {
      refSimulationStartTime.current = wholePlaybackTime * (1 - step / (report.end - report.start));
    }
  }, [play, step, report]);
  useEffect(() => {
    if (!manager || !report) return;

    if (!play) {
      window.cancelAnimationFrame(refRequestAnimationFrame.current);
      refTime.current = 0;
      return;
    }
    const playNextStep = (time: number) => {
      refRequestAnimationFrame.current = window.requestAnimationFrame(playNextStep);
      if (refTime.current === 0) {
        refTime.current = time;
      }
      const alpha =
        ((time + wholePlaybackTime - refSimulationStartTime.current - refTime.current) %
          wholePlaybackTime) /
        wholePlaybackTime;
      const simulationTime = alpha * (report.end - report.start);
      const frameIndex = Math.floor(simulationTime / report.delta);
      setStep(simulationTime);
      manager.setSimulationFrame(frameIndex);
    };
    refRequestAnimationFrame.current = window.requestAnimationFrame(playNextStep);
    // eslint-disable-next-line consistent-return
    return () => {
      window.cancelAnimationFrame(refRequestAnimationFrame.current);
    };
  }, [play, manager, report, setStep]);

  return [
    play,
    () => {
      setPlay(!play);
    },
  ];
}
