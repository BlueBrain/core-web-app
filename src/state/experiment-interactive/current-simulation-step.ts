import { useEffect } from 'react';
import { atom, useAtom } from 'jotai';

import { SimulationReport } from '@brayns/../simulations/resource-manager/backend-service';

const atomSimulationCurrentBiologicalTime = atom<number>(0);

export function useSimulationCurrentBiologicalTime(
  report: SimulationReport | undefined | null
): [time: number, setTime: (time: number) => void] {
  const [time, setTime] = useAtom(atomSimulationCurrentBiologicalTime);
  useEffect(() => {
    if (!report) {
      setTime(0);
      return;
    }
    if (time < report.start) setTime(report.start);
    else if (time > report.end) setTime(report.end);
  }, [time, setTime, report]);
  return [time, setTime];
}

export function useSimulationCurrentStep(
  report: SimulationReport | undefined | null
): [step: number, setStep: (time: number) => void] {
  const [time, setTime] = useSimulationCurrentBiologicalTime(report);
  if (!report) return [0, () => {}];

  const step = Math.floor((time - report.start) / report.delta);
  const setStep = (value: number) => {
    setTime(report.start + report.delta * value);
  };
  return [step, setStep];
}
