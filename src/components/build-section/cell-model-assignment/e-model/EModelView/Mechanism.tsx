import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { useEffect } from 'react';

import { StandardFallback } from './ErrorMessageLine';
import Header from './Header';

import CentralLoadingSpinner from '@/components/CentralLoadingSpinner';

import {
  eModelEditModeAtom,
  eModelUIConfigAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import { eModelMechanismsAtomFamily } from '@/state/e-model';
import { detailFamily } from '@/state/explore-section/detail-view-atoms';
import { EModelConfigurationMechanism, MechanismForUI, MechanismLocation } from '@/types/e-model';
import { mechanismLocations } from '@/constants/cell-model-assignment/e-model';
import DocumentationIcon from '@/components/icons/Documentation';
import { useUnwrappedValue } from '@/hooks/hooks';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';

type Params = {
  id: string;
  projectId: string;
  virtualLabId: string;
};

export default function Mechanism({ params }: { params: Params }) {
  const info = useResourceInfoFromPath();
  const detail = useUnwrappedValue(detailFamily(info));
  const mechanisms = useAtomValue(
    loadable(
      eModelMechanismsAtomFamily({
        eModelId: detail?.['@id'] || '',
        projectId: params.projectId,
        virtualLabId: params.virtualLabId,
      })
    )
  );

  const eModelEditMode = useAtomValue(eModelEditModeAtom);
  const setEModelUIConfig = useSetAtom(eModelUIConfigAtom);

  useEffect(() => {
    if (!eModelEditMode || !mechanisms) return;

    setEModelUIConfig((oldAtomData) => ({
      ...oldAtomData,
      mechanisms: structuredClone(mechanisms),
    }));
  }, [eModelEditMode, mechanisms, setEModelUIConfig]);

  const title = 'Mechanisms';

  if (mechanisms.state === 'loading') {
    return (
      <div className="flex flex-col gap-4">
        <Header>{title}</Header>
        <CentralLoadingSpinner />
      </div>
    );
  }

  if (mechanisms.state === 'hasError') {
    return (
      <div className="flex flex-col gap-4">
        <StandardFallback type="error">{title}</StandardFallback>
      </div>
    );
  }

  if (mechanisms.state === 'hasData') {
    return (
      <div className="flex flex-col gap-4">
        <Header>{title}</Header>
        <MechanismTable mechanismCollection={mechanisms.data} />
      </div>
    );
  }
}

type MechanismTableProps = {
  mechanismCollection: MechanismForUI | null;
};

function MechanismTable({ mechanismCollection }: MechanismTableProps) {
  const locations: MechanismLocation[] = [...mechanismLocations].sort();

  const getMechanismInfo = (location: MechanismLocation) =>
    (mechanismCollection?.processed?.[location] as EModelConfigurationMechanism[]) || [null];

  return (
    <div className="grid grid-cols-10">
      {locations.map((location) => (
        <div key={location} className="flex flex-col">
          <div className="my-4 flex items-center gap-2 text-gray-400">
            {location.toUpperCase()}
            <DocumentationIcon />
          </div>
          {getMechanismInfo(location).map((mechanism, index) => (
            <div key={`${location}_${mechanism?.name}`}>
              {mechanism ? (
                <div key={mechanism.name} className="font-bold">
                  <span className="mr-2 text-sm font-light text-gray-400">{index + 1}.</span>
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
