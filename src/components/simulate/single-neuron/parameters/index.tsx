'use client';

import { useAtomValue } from 'jotai';

import Stimulation from './Stimulation';
import Recording from './Recording';
import Conditions from './Conditions';
import Analysis from './Analysis';
import Visualization from './Visualization';
import { simulateStepAtom } from '@/state/simulate/single-neuron';

export default function ParameterView() {
  const simulateStep = useAtomValue(simulateStepAtom);

  return (
    <div className="w-full px-8 py-6">
      <div className="text-3xl font-bold capitalize text-primary-8">{simulateStep}</div>
      <div className="mt-10 text-center text-2xl">
        <div className={simulateStep === 'stimulation' ? '' : 'hidden'}>
          <Stimulation />
        </div>
        <div className={simulateStep === 'recording' ? '' : 'hidden'}>
          <Recording />
        </div>
        <div className={simulateStep === 'conditions' ? '' : 'hidden'}>
          <Conditions />
        </div>
        <div className={simulateStep === 'analysis' ? '' : 'hidden'}>
          <Analysis />
        </div>
        <div className={simulateStep === 'visualization' ? '' : 'hidden'}>
          <Visualization />
        </div>
      </div>
    </div>
  );
}
