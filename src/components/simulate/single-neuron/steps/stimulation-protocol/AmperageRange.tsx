import { useEffect, useReducer } from 'react';
import { InputNumber } from 'antd';
import { useAtomValue } from 'jotai';
import isEqual from 'lodash/isEqual';
import dynamic from 'next/dynamic';

import { useCurrentInjectionSimulationConfig } from '@/state/simulate/categories';
import { StimulusModule } from '@/types/simulation/single-neuron';
import {
  calculateRangeOutput,
  DEFAULT_PROTOCOL,
  MAX_AMPERAGE_STEPS,
  PROTOCOL_DETAILS,
} from '@/constants/simulate/single-neuron';
import { secNamesAtom } from '@/state/simulate/single-neuron';
import { synaptomeSimulationConfigAtom } from '@/state/simulate/categories/synaptome-simulation-config';

const StimuliPreviewPlot = dynamic(() => import('../../visualization/StimuliPreviewPlot'), {
  ssr: false,
});

const getInitialAmperageState = (protocol: StimulusModule) => {
  const { min: start, max: end, step } = PROTOCOL_DETAILS[protocol].defaults.current;
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
  type:
    | 'start'
    | 'end'
    | 'stepValue'
    | 'checkConsistency'
    | 'reset-for-protocol'
    | 'constant-value';
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
  amplitudes: number[] | number;
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
    case 'constant-value':
      newState.start = newVal;
      newState.end = newVal;
      newState.stepValue = 1;
      newState.computed = calculateRangeOutput(newState.start, newState.end, newState.stepValue);
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
  const morphologySections = useAtomValue(secNamesAtom);
  const synapsesConfig = useAtomValue(synaptomeSimulationConfigAtom);

  const synapseIdxWithFrequencyRange =
    synapsesConfig?.findIndex((synConfig) => Array.isArray(synConfig.frequency)) ?? -1;

  const [amperageState, dispatch] = useReducer(rangeReducer, {
    ...getInitialAmperageState(DEFAULT_PROTOCOL),
  });

  const { setAmplitudes } = useCurrentInjectionSimulationConfig();
  useEffect(() => {
    if (isEqual(amperageState.computed, amplitudes)) return;
    const variableFrequencyExists = synapseIdxWithFrequencyRange !== -1;
    setAmplitudes({
      id: stimulationId,
      newValue: variableFrequencyExists ? amperageState.computed[0] : amperageState.computed,
    });
  }, [
    amperageState.computed,
    amperageState.error,
    amplitudes,
    setAmplitudes,
    stimulationId,
    synapseIdxWithFrequencyRange,
  ]);

  useEffect(() => {
    dispatch({ type: 'reset-for-protocol', payload: protocol });
  }, [protocol]);

  useEffect(() => {
    // If user sets a synapse with frequency range, automatically convert amplitude to a constant value
    if (synapseIdxWithFrequencyRange !== -1) {
      dispatch({
        type: 'constant-value',
        payload: PROTOCOL_DETAILS[protocol].defaults.current.min,
      });
    } else {
      dispatch({ type: 'reset-for-protocol', payload: protocol });
    }
  }, [synapseIdxWithFrequencyRange, protocol]);

  return (
    <>
      <div className="mb-3 mt-8 text-left text-base">
        <span className="ml-2 uppercase text-gray-400">Amperage</span>
        {amperageState.error && (
          <i className="ml-2 text-base font-light text-error">{amperageState.error}</i>
        )}
      </div>
      {synapseIdxWithFrequencyRange !== -1 ? (
        <div className="text-left">
          <InputNumber
            required
            placeholder="start"
            min={-100}
            max={100}
            value={amperageState.start}
            size="small"
            className="min-w-18 mx-2 h-8 [&_.ant-input-number-input]:!pr-8 [&_.ant-input-number-input]:!text-right [&_.ant-input-number-input]:!font-bold [&_.ant-input-number-input]:!text-primary-8"
            onChange={(newVal) => dispatch({ type: 'constant-value', payload: newVal })}
            onBlur={() => dispatch({ type: 'checkConsistency', payload: null })}
            aria-label="constant amplitude"
          />
          <span className="text-gray-400">[nA]</span>
        </div>
      ) : (
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
      )}

      {!amperageState.error && Boolean(morphologySections.length) && (
        <StimuliPreviewPlot
          amplitudes={amperageState.computed}
          protocol={amperageState.protocol}
          modelSelfUrl={modelSelfUrl}
        />
      )}
    </>
  );
}
