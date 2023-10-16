import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

import {
  eModelEditModeAtom,
  eModelMechanismsAtom,
  eModelUIConfigAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import { EModelConfigurationMechanism, MechanismForUI, MechanismLocation } from '@/types/e-model';
import { mechanismLocations } from '@/constants/cell-model-assignment/e-model';
import DocumentationIcon from '@/components/icons/Documentation';

export default function Mechanism() {
  const mechanisms = useAtomValue(eModelMechanismsAtom);
  const eModelEditMode = useAtomValue(eModelEditModeAtom);
  const setEModelUIConfig = useSetAtom(eModelUIConfigAtom);

  useEffect(() => {
    if (!eModelEditMode || !mechanisms) return;

    setEModelUIConfig((oldAtomData) => ({
      ...oldAtomData,
      mechanisms: structuredClone(mechanisms),
    }));
  }, [eModelEditMode, mechanisms, setEModelUIConfig]);

  return (
    <div className="text-primary-8">
      <span className="text-2xl font-bold">Mechanisms</span>
      <MechanismTable mechanismCollection={mechanisms} />
    </div>
  );
}

type MechanismTableProps = {
  mechanismCollection: MechanismForUI | null;
};

function MechanismTable({ mechanismCollection }: MechanismTableProps) {
  const locations: MechanismLocation[] = [...mechanismLocations].sort();

  const getMechanismInfo = (location: MechanismLocation) =>
    (mechanismCollection?.processed?.[location] as EModelConfigurationMechanism[]) || [null];

  return (
    <div className="flex gap-8 flex-wrap justify-between">
      {locations.map((location) => (
        <div key={location} className="flex flex-col">
          <div className="text-gray-400 flex gap-2 items-center my-4">
            {location.toUpperCase()}
            <DocumentationIcon />
          </div>
          {getMechanismInfo(location).map((mechanism, index) => (
            <div key={`${location}_${mechanism?.name}`}>
              {mechanism ? (
                <div key={mechanism.name} className="font-bold">
                  <span className="text-sm font-light text-gray-400 mr-2">{index + 1}.</span>
                  {mechanism.name}
                </div>
              ) : (
                <div className="text-gray-400">- Not present</div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
