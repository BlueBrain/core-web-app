import { useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';

import {
  eModelEditModeAtom,
  eModelUIConfigAtom,
  simulationParametersAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import { SimulationParameterKeys } from '@/types/e-model';

export default function SimulationParameters() {
  const simulationParameters = useAtomValue(simulationParametersAtom);
  const eModelEditMode = useAtomValue(eModelEditModeAtom);
  const [eModelUIConfig, setEModelUIConfig] = useAtom(eModelUIConfigAtom);

  useEffect(() => {
    if (!eModelEditMode || !simulationParameters) return;

    setEModelUIConfig((oldAtomData) => ({
      ...oldAtomData,
      parameters: structuredClone(simulationParameters),
    }));
  }, [eModelEditMode, simulationParameters, setEModelUIConfig]);

  const onParamChange = (paramName: SimulationParameterKeys, value: number) => {
    setEModelUIConfig((oldAtomData) => {
      if (!oldAtomData?.parameters) return oldAtomData;

      return {
        ...oldAtomData,
        parameters: {
          ...oldAtomData.parameters,
          [paramName]: value,
        },
      };
    });
  };

  const parameters = eModelEditMode ? eModelUIConfig?.parameters : simulationParameters;

  const paramKeys = Object.keys(
    parameters || {}
  ) as SimulationParameterKeys[] satisfies SimulationParameterKeys[];

  if (!parameters) return null;

  return (
    <>
      <div className="text-2xl font-bold text-primary-8 my-4">Simulation parameters</div>
      <div className="flex flex-wrap flex-col h-[60px] gap-2">
        {paramKeys.map((paramKey) => (
          <div key={paramKey} className="w-[200px] flex justify-between text-primary-7">
            <Item
              name={paramKey}
              value={parameters[paramKey]}
              readOnly={!eModelEditMode}
              onChange={onParamChange}
            />
          </div>
        ))}
      </div>
    </>
  );
}

type ItemProps = {
  name: SimulationParameterKeys;
  value: number;
  readOnly: boolean;
  onChange: (name: SimulationParameterKeys, value: number) => void;
};

function Item({ name, value, readOnly, onChange }: ItemProps) {
  return (
    <>
      <span className="grow">{name}</span>
      <input
        type="number"
        disabled={readOnly}
        value={value}
        onChange={(e) => onChange(name, e.target.valueAsNumber)}
        className="w-[50px] text-right border-2 font-bold rounded"
      />
    </>
  );
}
