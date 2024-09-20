import { useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';

import Header from './Header';

import {
  eModelEditModeAtom,
  eModelUIConfigAtom,
  simulationParametersAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import { SimulationParameterKeys } from '@/types/e-model';
import { eCodesMetadata } from '@/constants/cell-model-assignment/e-model';

export default function SimulationParameters() {
  const simulationParameters = useAtomValue(simulationParametersAtom);
  const eModelEditMode = useAtomValue(eModelEditModeAtom);
  const [eModelUIConfig, setEModelUIConfig] = useAtom(eModelUIConfigAtom);

  useEffect(() => {
    if (!eModelEditMode || !simulationParameters) return;

    setEModelUIConfig((oldAtomData) => ({
      ...oldAtomData,
      parameters: structuredClone(simulationParameters),
      ecodes_metadata: eCodesMetadata,
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

  const requiredParameterKeys: Array<SimulationParameterKeys> = [
    'Temperature (°C)',
    'Initial voltage',
    'Ra',
  ];

  if (!parameters) return null;

  return (
    <div className="flex flex-col gap-4">
      <Header>Simulation parameters</Header>
      <div className="grid grid-cols-3 gap-2">
        {paramKeys.map((paramKey) => {
          const isRequired = requiredParameterKeys.find((requiredKey) => requiredKey === paramKey);

          return (
            <div
              key={paramKey}
              className="flex w-[200px] items-center justify-between text-primary-7"
            >
              <Item
                error={isRequired && !parameters[paramKey]}
                name={paramKey}
                value={parameters[paramKey]}
                readOnly={!eModelEditMode}
                onChange={onParamChange}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

type ItemProps = {
  error?: boolean;
  name: SimulationParameterKeys;
  value: number;
  readOnly: boolean;
  onChange: (name: SimulationParameterKeys, value: number) => void;
};

function Item({ error, name, value, readOnly, onChange }: ItemProps) {
  const label = <span className="grow">{name}</span>;

  if (readOnly && error) {
    return (
      <>
        {label}
        <div className="font-bold text-error">No information available</div>
      </>
    );
  }

  if (readOnly && !value) {
    return (
      <>
        {label}
        <div className="font-bold text-neutral-4">No information available</div>
      </>
    );
  }

  return (
    <>
      {label}
      {readOnly ? (
        <div className="font-bold">{value}</div>
      ) : (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(name, e.target.valueAsNumber)}
          className="w-[50px] rounded border-2 text-right font-bold"
        />
      )}
    </>
  );
}
