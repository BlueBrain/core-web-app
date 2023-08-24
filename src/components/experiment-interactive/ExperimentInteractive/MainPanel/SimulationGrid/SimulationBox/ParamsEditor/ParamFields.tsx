import { useAtomValue } from 'jotai';

import { displayedSimulationParamsConfigAtom } from '@/state/experiment-interactive';
import { useSimulationPreview } from '@/components/experiment-interactive/ExperimentInteractive/MainPanel/SimulationGrid/SimulationBox/hooks';
import ParamField from '@/components/experiment-interactive/ExperimentInteractive/MainPanel/SimulationGrid/SimulationBox/ParamsEditor/ParamField';

interface ParamFieldsProps {
  onChange: (paramKey: string, value: number) => void;
}

export default function ParamFields({ onChange }: ParamFieldsProps) {
  const displayedSimulationParamsConfig = useAtomValue(displayedSimulationParamsConfigAtom);

  const { simulationPreview, setEditedParamKey } = useSimulationPreview();

  return (
    <div className="flex items-center gap-3 mr-10">
      <div className="w-full flex flex-col gap-1">
        {displayedSimulationParamsConfig.map(({ paramKey, color, minValue, maxValue }) => (
          <ParamField
            key={paramKey}
            paramKey={paramKey}
            color={color}
            minValue={minValue}
            maxValue={maxValue}
            value={simulationPreview.editParams?.[paramKey] ?? 0}
            onChange={onChange}
            onFocus={() => setEditedParamKey(paramKey)}
          />
        ))}
      </div>
    </div>
  );
}
