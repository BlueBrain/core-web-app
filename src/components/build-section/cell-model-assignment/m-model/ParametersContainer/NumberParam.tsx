import { Slider } from 'antd';

import { ParamInfo } from '@/types/m-model';

type ParameterProps = {
  paramValue: number;
  paramInfo: ParamInfo;
  onChange: (newValue: number) => void;
  isConfigEditable: boolean;
};

export default function NumberParam({
  paramValue,
  paramInfo,
  onChange,
  isConfigEditable,
}: ParameterProps) {
  const { min, max, step, displayName } = paramInfo;

  const sanitize = (changedValue: unknown) => {
    if (typeof changedValue === 'number') {
      if (changedValue > max) return max;
      if (changedValue < min) return min;
      return changedValue;
    }
    return 0;
  };

  if (typeof paramValue !== 'number') {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between">
        <div>{displayName}</div>
        <input
          type="number"
          className="w-[40px] rounded border text-end font-bold text-primary-8"
          value={sanitize(paramValue)}
          step={step}
          onChange={(e) => onChange(sanitize(e.target.valueAsNumber))}
        />
      </div>
      <Slider
        max={max}
        min={min}
        step={step}
        tooltip={{ open: false }}
        onChange={onChange}
        value={sanitize(paramValue)}
        disabled={!isConfigEditable}
      />
    </div>
  );
}
