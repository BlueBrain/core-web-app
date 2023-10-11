import { Slider } from 'antd';

import { useAtom, useAtomValue } from 'jotai';
import { DndContext, DragMoveEvent } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import round from 'lodash/round';
import ceil from 'lodash/ceil';

import { adjustIndicatorPosition, calculatePercentX, restrictToParentElement } from '../../utils';
import ActiveStepIndicator from './ActiveStepIndicator';
import TimeAxis from './TimeAxis';
import {
  playbackActiveStepAtom,
  simulationDataAtom,
  useSimulationCurrentStep,
} from '@/state/experiment-interactive';
import { SimulationReport } from '@/services/brayns/simulations/resource-manager/backend-service';
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
