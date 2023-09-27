import { Slider } from 'antd';

import NumberInput from '@/components/experiment-interactive/ExperimentInteractive/NumberInput';
import { classNames } from '@/util/utils';
import { SimulationParameterKey } from '@/components/experiment-interactive/types';
import { useSimulationPreview } from '@/components/experiment-interactive/ExperimentInteractive/MainPanel/SimulationGrid/SimulationBox.backup/hooks';

interface ParamFieldProps {
  paramKey: SimulationParameterKey;
  color: string;
  minValue: number;
  maxValue: number;
  value: number;
  onChange: (paramKey: string, value: number) => void;
  onFocus?: () => void;
}

export default function ParamField({
  paramKey,
  color,
  maxValue,
  minValue,
  value,
  onChange,
  onFocus,
}: ParamFieldProps) {
  const { editedParamKey } = useSimulationPreview();

  const onSliding = (newValue: number) => {
    onChange(paramKey, newValue);
  };

  return (
    <div className="flex flex-col">
      <div className="justify-start items-center gap-1.5 flex" key={paramKey}>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <div className="flex flex-row justify-between w-full">
          <div className="text-white text-xs font-semibold">{paramKey}</div>
          <div className="text-white text-xs font-semibold">
            <NumberInput
              value={value}
              size={5}
              onChange={(newValue) => onChange(paramKey, newValue)}
              onFocus={onFocus}
              min={minValue}
              max={maxValue}
            />
          </div>
        </div>
      </div>

      {editedParamKey === paramKey ? (
        <div className={classNames('flex grow items-center justify-between w-full pb-3')}>
          <Slider
            className="grow focus-visible:outline-none"
            disabled={false}
            tooltip={{ open: false }}
            min={minValue}
            max={maxValue}
            step={0.1}
            value={value}
            onChange={onSliding}
            range={false}
            trackStyle={{ backgroundColor: color, width: '100%', height: '2px' }}
          />
        </div>
      ) : null}
    </div>
  );
}
