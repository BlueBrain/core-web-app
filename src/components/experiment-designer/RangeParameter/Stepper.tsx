import { useEffect, useState } from 'react';

import { NumberOfStepsInput, StepSizeInput } from './CustomInputStepper';
import StepperRow from './StepperRow';
import type { ExpDesignerRangeParameter, StepperType } from '@/types/experiment-designer';
import { getNewStepper } from '@/components/experiment-designer/defaultNewObject';

type Props = {
  data: ExpDesignerRangeParameter;
  onChange: (stepper: StepperType) => void;
};

export default function Stepper({ data, onChange }: Props) {
  const [numberOfStepStepper, setNumberOfStepStepper] = useState<StepperType>(getNewStepper());
  const [stepSizeStepper, setStepSizeStepper] = useState<StepperType>({
    name: 'Step size',
    value: data.value.step,
  });
  const selectedStepperName = data.value.stepper.name;

  useEffect(() => {
    if (numberOfStepStepper.name === selectedStepperName) {
      onChange(numberOfStepStepper);
    } else if (stepSizeStepper.name === selectedStepperName) {
      onChange(stepSizeStepper);
    }
  }, [numberOfStepStepper, stepSizeStepper, selectedStepperName, onChange]);

  return (
    <>
      <StepperRow
        isChecked={numberOfStepStepper.name === selectedStepperName}
        onRadioSelect={() => onChange(numberOfStepStepper)}
        stepperName={numberOfStepStepper.name}
      >
        <NumberOfStepsInput
          data={data}
          onChange={(value: number) => {
            setNumberOfStepStepper((oldAtomData: StepperType) => ({
              ...oldAtomData,
              value,
            }));
          }}
          isChecked={numberOfStepStepper.name === selectedStepperName}
        />
      </StepperRow>

      <StepperRow
        isChecked={stepSizeStepper.name === selectedStepperName}
        onRadioSelect={() => onChange(stepSizeStepper)}
        stepperName={stepSizeStepper.name}
      >
        <StepSizeInput
          data={data}
          onChange={(value: number) => {
            setStepSizeStepper((oldAtomData: StepperType) => ({
              ...oldAtomData,
              value,
            }));
          }}
          isChecked={stepSizeStepper.name === selectedStepperName}
        />
      </StepperRow>
    </>
  );
}
