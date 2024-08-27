import { ReactNode,  useMemo, useRef, useState } from 'react';
import { Select, InputNumber } from 'antd';
import range from 'lodash/range';
import round from 'lodash/round';
import dynamic from 'next/dynamic';


const StimuliPreviewPlot = dynamic(() => import('../../visualization/StimuliPreviewPlot'), {
  ssr: false,
});

type AmperageStateType = {
  start: number;
  end: number;
  stepValue: number;
  stepType: StepType;
  computed: number[];
  isConsistent: boolean;
}

const amperageInitialState: AmperageStateType = {
  start: 40,
  end: 120,
  stepValue: 40,
  stepType: 'stepSize' as StepType,
  computed: [40, 80, 120] as number[],
  isConsistent: true,
};

type Props = {
  stimulationId: number;
  modelSelfUrl: string;
};

type StepType = 'stepSize' | 'stepNumber';

export default function AmperageRange({ modelSelfUrl, stimulationId }: Props) {
  const [state, update] = useState<AmperageStateType>(() => amperageInitialState);
  const [error, setError] = useState<string | null>(null);
  const calculatedAmplitudesRef = useRef<Array<number>>([]);

  const updateStart = (value: number | null) => {
    setError(null);
    if (value && value < state.end) {
      return update(prev => ({
        ...prev,
        start: value
      }))
    }
    setError("Start value should less then the end value.");
  }
  const updateEnd = (value: number | null) => {
    setError(null);
    if (value && state.start < value) {
      return update(prev => ({
        ...prev,
        start: value
      }))
    }
    setError("End value should be greater then the start value.");
  }
  const updateStepType = (value: StepType) => {
    setError(null);
    update(prev => ({
      ...prev,
      stepType: value
    }))
  }
  const updateStepValue = (value: number | null) => {
    setError(null);
    if (value) {
      const computed = calculateRangeOutput(state.start, state.end, {
        type: state.stepType,
        value,
      })
      if(computed.length > 15){
        setError("The result amplitudes list should not be greater than 15.");
        return;
      }
      if (state.stepType === 'stepNumber' && value === 0) {
        update(prev => ({
          ...prev,
          stepValue: 1
        }))
      }
      else if (state.stepType === 'stepSize' && value === 0) {
        update(prev => ({
          ...prev,
          stepValue: .1
        }))
      }
      update(prev => ({
        ...prev,
        stepValue: value,
      }));
    }
  }

  const calculatedAmplitudes = useMemo(() => {
    if (!error) {
      calculatedAmplitudesRef.current = calculateRangeOutput(state.start, state.end, {
        type: state.stepType,
        value: state.stepValue,
      });
      return calculatedAmplitudesRef.current;
    }
    return calculatedAmplitudesRef.current;
  }, [state, error]);

  return (
    <>
      <div className='flex flex-col items-start gap-1 mb-3'>
        <div className="text-left text-base">
          <span className="mr-1 font-bold text-red-400">*</span>
          <span>Amperage [nA]</span>
        </div>
        {error && <i className='font-light text-base text-pink-700'>{error}</i>}
      </div>
      <div className="flex gap-6 text-base">
        <InputNumber
          placeholder="start limit"
          step={0.1}
          min={-100}
          max={100}
          size="small"
          className="w-[60px]"
          value={state.start}
          onChange={updateStart}
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
          value={state.stepType}
          onChange={updateStepType}
          className="w-[140px]"
        />

        <InputNumber
          placeholder="step size"
          step={1}
          min={0}
          max={500}
          size="small"
          className="w-[60px]"
          value={state.stepValue}
          onChange={updateStepValue}
        />

        <span>⇨</span>

        <InputNumber
          placeholder="end limit"
          step={0.1}
          min={-100}
          max={1000}
          size="small"
          className="w-[60px]"
          value={state.end}
          onChange={updateEnd}
        />
      </div>

      <div className="mb-2 mt-4 text-left text-sm text-gray-400">Output amperages</div>
      <div className="mb-4 flex flex-wrap gap-4 text-base font-bold text-gray-400">
        {calculatedAmplitudes.map((value) => (
          <span key={value} className="">
            {value}
          </span>
        ))}
      </div>
      <StimuliPreviewPlot
        stimulationId={stimulationId}
        amplitudes={calculatedAmplitudes}
        modelSelfUrl={modelSelfUrl}
      />
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
