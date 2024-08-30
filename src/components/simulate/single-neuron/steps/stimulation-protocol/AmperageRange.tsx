import { useEffect, useReducer } from 'react';
import { InputNumber } from 'antd';
import range from 'lodash/range';
import round from 'lodash/round';
import isEqual from 'lodash/isEqual';
import dynamic from 'next/dynamic';

import { useCurrentInjectionSimulationConfig } from '@/state/simulate/categories';
import { StimulusModule } from '@/types/simulation/single-neuron';
import {
  DEFAULT_PROTOCOL,
  MAX_AMPERAGE_STEPS,
  stimulusParams,
} from '@/constants/simulate/single-neuron';

const StimuliPreviewPlot = dynamic(() => import('../../visualization/StimuliPreviewPlot'), {
  ssr: false,
});

const getInitialAmperageState = (protocol: StimulusModule) => {
  const { min: start, max: end, step } = stimulusParams[protocol].params;
  return {
    protocol,
    start,
    end,
    stepValue: step,
    computed: calculateRangeOutput(start, end, step),
    error: null as string | null,
  };
};

type AmperageActionType = {
  type: 'start' | 'end' | 'stepValue' | 'checkConsistency' | 'reset-for-protocol';
  payload: any;
};

type AmperageStateType = {
  protocol: StimulusModule;
  start: number;
  end: number;
  stepValue: number;
  computed: number[];
  error: null | string;
};

type Props = {
  stimulationId: number;
  amplitudes: number[];
  modelSelfUrl: string;
  protocol: StimulusModule;
};

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

      newState.computed = calculateRangeOutput(newState.start, newState.end, newState.stepValue);

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
      <div className="mb-3 mt-8 text-left text-base">
        <span className="ml-2 uppercase text-gray-400">Amperage</span>
        {amperageState.error && (
          <i className="ml-2 text-base font-light text-error">{amperageState.error}</i>
        )}
      </div>
      <div className="ml-2 flex items-center justify-between gap-6 text-base">
        <div className="flex items-center">
          <div>
            <span className="font-bold text-primary-8">Start</span>
            <InputNumber
              placeholder="start"
              step={0.1}
              min={-100}
              max={100}
              size="small"
              className="min-w-18 mx-2 h-8 [&_.ant-input-number-input]:!pr-8 [&_.ant-input-number-input]:!text-right [&_.ant-input-number-input]:!font-bold [&_.ant-input-number-input]:!text-primary-8"
              value={amperageState.start}
              onChange={(newVal) => dispatch({ type: 'start', payload: newVal })}
              onBlur={() => dispatch({ type: 'checkConsistency', payload: null })}
              aria-label="start"
            />
            <span className="text-gray-400">[nA]</span>
          </div>
          <hr className="mx-4 w-8 border border-gray-200" />
          <div>
            <span className="font-bold text-primary-8">Stop</span>
            <InputNumber
              placeholder="end"
              step={0.1}
              min={-100}
              max={1000}
              size="small"
              className="min-w-18 mx-2 h-8 [&_.ant-input-number-input]:!pr-8 [&_.ant-input-number-input]:!text-right [&_.ant-input-number-input]:!font-bold [&_.ant-input-number-input]:!text-primary-8"
              value={amperageState.end}
              onChange={(newVal) => dispatch({ type: 'end', payload: newVal })}
              onBlur={() => dispatch({ type: 'checkConsistency', payload: null })}
            />
            <span className="text-gray-400">[nA]</span>
          </div>
        </div>

        <div>
          <span className="font-bold text-primary-8">N° of steps</span>
          <InputNumber
            placeholder="step size"
            step={1}
            min={0}
            max={500}
            size="small"
            className="mx-2 h-8 min-w-10 [&_.ant-input-number-handler-wrap]:!opacity-100 [&_.ant-input-number-input]:!pr-8 [&_.ant-input-number-input]:!text-right [&_.ant-input-number-input]:!font-bold [&_.ant-input-number-input]:!text-primary-8"
            value={amperageState.stepValue}
            onChange={(newVal) => dispatch({ type: 'stepValue', payload: newVal })}
            onBlur={() => dispatch({ type: 'checkConsistency', payload: null })}
          />
        </div>
      </div>

      {!amperageState.error && (
        <StimuliPreviewPlot
          amplitudes={amperageState.computed}
          protocol={amperageState.protocol}
          modelSelfUrl={modelSelfUrl}
        />
      )}
    </>
  );
}

function calculateRangeOutput(start: number, end: number, step: number) {
  if (step <= 0) return [];
  if (start === end) return [start];

  let values: number[];

  if (step === 1) {
    values = [(start + end) / 2];
  } else if (step === 2) {
    values = [start, end];
  } else {
    const steps = (end - start) / (step - 1);
    values = [...range(start, end, steps), end];
  }

  return values.map((v) => round(v, 2));
}
