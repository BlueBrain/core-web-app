import { useAtomValue } from 'jotai';

import { simulationParametersAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';
import { SimulationParameterKeys } from '@/types/e-model';

export default function SimulationParameters() {
  const simulationParameters = useAtomValue(simulationParametersAtom);
  const paramKeys = Object.keys(
    simulationParameters || {}
  ) as SimulationParameterKeys[] satisfies SimulationParameterKeys[];

  if (!simulationParameters) return null;

  return (
    <>
      <div className="text-2xl font-bold text-primary-8 my-4">Simulation parameters</div>
      <div className="flex flex-wrap flex-col h-[60px] gap-2">
        {paramKeys.map((paramKey) => (
          <div key={paramKey} className="w-[200px] flex justify-between text-primary-7">
            <Item name={paramKey} value={simulationParameters[paramKey]} />
          </div>
        ))}
      </div>
    </>
  );
}

function Item({ name, value }: { name: string; value: number }) {
  return (
    <>
      <span className="grow">{name}</span>
      <input
        type="number"
        readOnly
        value={value}
        className="w-[50px] text-right border-2 font-bold rounded"
      />
    </>
  );
}
