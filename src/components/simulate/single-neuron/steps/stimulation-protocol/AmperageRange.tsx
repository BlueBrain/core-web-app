import { ReactNode, useEffect, useReducer } from 'react';
import { Select, InputNumber } from 'antd';
import range from 'lodash/range';
import round from 'lodash/round';
import isEqual from 'lodash/isEqual';
import dynamic from 'next/dynamic';

import { useCurrentInjectionSimulationConfig } from '@/state/simulate/categories';
import { StimulusModule } from '@/types/simulation/single-neuron';
import { DEFAULT_PROTOCOL, stimulusParams } from '@/constants/simulate/single-neuron';

const StimuliPreviewPlot = dynamic(() => import('../../visualization/StimuliPreviewPlot'), {
  ssr: false,
});

// Each amperage starts a new simulation process in the server. To limit resource consumption, we put a maximum threshold on number of amperages a simulation can have.
const MAX_AMPERAGE_STEPS = 15;

const getInitialAmperageState = (protocol: StimulusModule) => {
  const { min: start, max: end, step } = stimulusParams[protocol].params;
  return {
    start,
    end,
    stepValue: step,
    stepType: 'stepSize' as StepType,
    computed: calculateRangeOutput(start, end, { type: 'stepSize', value: step }),
    error: null as string | null,
  };
};

type AmperageActionType = {
  type: 'start' | 'end' | 'stepValue' | 'stepType' | 'checkConsistency' | 'reset-for-protocol';
  payload: any;
};

type AmperageStateType = {
  start: number;
  end: number;
  stepValue: number;
  stepType: StepType;
  computed: number[];
  error: null | string;
};

type Props = {
  stimulationId: number;
  amplitudes: number[];
  modelSelfUrl: string;
  protocol: StimulusModule;
};

type StepType = 'stepSize' | 'stepNumber';

function rangeReducer(state: AmperageStateType, action: AmperageActionType) {
  const newState = { ...state } satisfies AmperageStateType;
  const newVal = action.payload;
  switch (action.type) {
    case 'start':
      newState.start = newVal;
      break;
    case 'end':
      newState.end = newVal;
      break;
    case 'stepType':
      newState.stepType = newVal;
      break;
    case 'stepValue':
      if (newVal < 0) {
        newState.stepValue = 0;
        break;
      }
      newState.stepValue = newVal;
      break;
    case 'reset-for-protocol':
      Object.assign(newState, { ...getInitialAmperageState(newVal) });
      break;
    case 'checkConsistency':
      if (state.start > state.end) {
        newState.error = 'Start should be less than end';
        break;
      } else if (state.end < state.start) {
        newState.error = 'End should be greater than start';
        break;
      }
      if (state.stepType === 'stepNumber' && state.stepValue === 0) {
        newState.error = `Step value should be at least 1 and atmost ${MAX_AMPERAGE_STEPS}`;
        break;
      }
      if (state.stepType === 'stepSize' && state.stepValue === 0) {
        newState.error = 'Step size cannot be 0';
        break;
      }

      newState.computed = calculateRangeOutput(newState.start, newState.end, {
        type: newState.stepType,
        value: newState.stepValue,
      });

      if (newState.computed.length > MAX_AMPERAGE_STEPS) {
        newState.error = `There should be a maximum of ${MAX_AMPERAGE_STEPS} amperages in a simulation. Currently there are ${newState.computed.length}`;
      } else {
        newState.error = null;
      }
      break;
    default:
      throw new Error('Action not found', action.type);
  }
  return newState;
}

export default function AmperageRange({
  amplitudes,
  stimulationId,
  modelSelfUrl,
  protocol,
}: Props) {
  const [amperageState, dispatch] = useReducer(rangeReducer, {
    ...getInitialAmperageState(DEFAULT_PROTOCOL),
  });

  const { setAmplitudes } = useCurrentInjectionSimulationConfig();
  useEffect(() => {
    if (isEqual(amperageState.computed, amplitudes)) return;
    setAmplitudes({
      id: stimulationId,
      newValue: amperageState.computed,
    });
  }, [amperageState.computed, amperageState.error, amplitudes, setAmplitudes, stimulationId]);

  useEffect(() => {
    dispatch({ type: 'reset-for-protocol', payload: protocol });
  }, [protocol]);

  return (
    <>
      <div className="mb-3 text-left text-base">
        <span className="mr-1 font-bold text-red-400">*</span>
        <span>Amperage [nA]</span>
        {amperageState.error && (
          <i className="ml-2 text-base font-light text-error">{amperageState.error}</i>
        )}
      </div>
      <div className="flex gap-6 text-base">
        <InputNumber
          placeholder="start limit"
          step={0.1}
          min={-100}
          max={100}
          size="small"
          className="w-[60px]"
          value={amperageState.start}
          onChange={(newVal) => dispatch({ type: 'start', payload: newVal })}
          onBlur={() => dispatch({ type: 'checkConsistency', payload: null })}
        />

        <span>⇨</span>

        <Select
          options={
            [
              { value: 'stepSize', label: <span>Step size</span> },
              { value: 'stepNumber', label: <span>Number of steps</span> },
            ] satisfies { value: StepType; label: ReactNode }[]
          }
          size="small"
          value={amperageState.stepType}
          onChange={(newVal: StepType) => dispatch({ type: 'stepType', payload: newVal })}
          onBlur={() => dispatch({ type: 'checkConsistency', payload: null })}
          className="w-[140px]"
        />

        <InputNumber
          placeholder="step size"
          step={1}
          min={0}
          max={500}
          size="small"
          className="w-[60px]"
          value={amperageState.stepValue}
          onChange={(newVal) => dispatch({ type: 'stepValue', payload: newVal })}
          onBlur={() => dispatch({ type: 'checkConsistency', payload: null })}
        />

        <span>⇨</span>

        <InputNumber
          placeholder="end limit"
          step={0.1}
          min={-100}
          max={1000}
          size="small"
          className="w-[60px]"
          value={amperageState.end}
          onChange={(newVal) => dispatch({ type: 'end', payload: newVal })}
          onBlur={() => dispatch({ type: 'checkConsistency', payload: null })}
        />
      </div>

      {!amperageState.error && (
        <StimuliPreviewPlot amplitudes={amperageState.computed} modelSelfUrl={modelSelfUrl} />
      )}
    </>
  );
}

function calculateRangeOutput(start: number, end: number, step: { type: StepType; value: number }) {
  if (step.value <= 0) return [];
  if (start === end) return [start];

  let values: number[];

  if (step.type === 'stepNumber') {
    if (step.value === 1) {
      values = [(start + end) / 2];
    } else if (step.value === 2) {
      values = [start, end];
    } else {
      const steps = (end - start) / (step.value - 1);
      values = [...range(start, end, steps), end];
    }
  } else {
    values = [...range(start, end, step.value), end];
  }
  return values.map((v) => round(v, 2));
}
