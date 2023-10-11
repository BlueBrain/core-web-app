import { useEffect } from 'react';
import { atom, useAtom } from 'jotai';

import { SimulationReport } from '../../services/brayns/simulations/resource-manager/backend-service';

const atomSimulationCurrentStep = atom<number>(0);

export function useSimulationCurrentStep(
  report: SimulationReport | undefined | null
): [step: number, setStep: (step: number) => void] {
  const [step, setStep] = useAtom(atomSimulationCurrentStep);
  useEffect(() => {
    if (!report) {
      setStep(0);
      return;
    }
    if (step < report.start) setStep(report.start);
    else if (step > report.end) setStep(report.end);
  }, [step, setStep, report]);
  return [step, setStep];
}
