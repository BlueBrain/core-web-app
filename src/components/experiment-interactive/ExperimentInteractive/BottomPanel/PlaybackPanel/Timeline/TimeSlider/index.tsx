import { Slider } from 'antd';

import { useEffect } from 'react';
import { useSimulationCurrentStep } from '@/state/experiment-interactive';
import { useMultiBraynsManager } from '@/services/brayns/simulations';
import { useCurrentSimulationReport } from '@/components/experiment-interactive/ExperimentInteractive/hooks/current-report';
import Spinner from '@/components/Spinner';

export default function TimeSlider() {
  const report = useCurrentSimulationReport();
  const [step, setStep] = useSimulationCurrentStep(report);
  const manager = useMultiBraynsManager();
  useEffect(() => {
    if (!manager || !report) return;

    const frameIndex = Math.floor((step - report.start) / report.delta);
    manager.setSimulationFrame(frameIndex);
  }, [step, manager, report]);
  if (report === null) {
    return (
      <div
        role="alert"
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      >
        An error prevent us from loading the simulation report!
      </div>
    );
  }
  if (!report) {
    return <Spinner>Loading...</Spinner>;
  }
  return (
    <Slider
      value={step}
      onChange={setStep}
      min={report.start}
      max={report.end}
      step={report.delta}
      railStyle={{
        background: '#fff7',
      }}
      trackStyle={{
        background: '#fffe',
      }}
      handleStyle={{}}
      tooltip={{ formatter: formatTooltip }}
    />
  );
}

function formatTooltip(value?: number) {
  return <div>{value ?? 0} ms</div>;
}
