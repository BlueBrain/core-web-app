import NumberParam from './NumberParam';
import { ParamInfo, StepSizeInterface } from '@/types/m-model';

type ParameterProps = {
  paramValue: StepSizeInterface;
  paramInfo: ParamInfo;
  onChange: (newValue: StepSizeInterface) => void;
  isConfigEditable: boolean;
};

export default function StepSizeParam({
  paramValue,
  paramInfo,
  onChange,
  isConfigEditable,
}: ParameterProps) {
  const value = paramValue?.norm?.mean;

  const onStepChange = (newValue: number) => {
    const cloned = structuredClone(paramValue);
    cloned.norm.mean = newValue;
    onChange(cloned);
  };

  return (
    <NumberParam
      paramValue={value}
      paramInfo={paramInfo}
      onChange={onStepChange}
      isConfigEditable={isConfigEditable}
    />
  );
}
