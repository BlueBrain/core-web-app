import { useEffect, useMemo, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Spin } from 'antd';
import CustomAnalysis from './CustomAnalysis';
import { SimulationCampaignResource } from '@/types/explore-section/resources';
import DimensionSelector from '@/components/explore-section/Simulations/DimensionSelector';
import SimulationsDisplayGrid from '@/components/explore-section/Simulations/SimulationsDisplayGrid';
import {
  dimensionsAtom,
  getInitializeDimensionsAtom,
} from '@/components/explore-section/Simulations/state';
import { getSimulationsAtom } from '@/state/explore-section/simulation-campaign';
import SimulationOptionsDropdown from '@/components/explore-section/Simulations/DisplayDropdown';
import {
  displayOptions,
  showOnlyOptions,
} from '@/components/explore-section/Simulations/constants';
import { useAnalyses } from '@/app/explore/(content)/simulation-campaigns/shared';
import { useEnsuredPath, useUnwrappedValue } from '@/hooks/hooks';

export default function Simulations({ resource }: { resource: SimulationCampaignResource }) {
  const [selectedDisplay, setSelectedDisplay] = useState<string>('raster');
  const [showStatus, setShowStatus] = useState<string>('all');
  const path = useEnsuredPath();
  const dimensions = useAtomValue(dimensionsAtom);
  const setDefaultDimensions = useSetAtom(getInitializeDimensionsAtom(path));
  const simulations = useUnwrappedValue(getSimulationsAtom(path));
  const [analyses] = useAnalyses();

  const isCustom = useMemo(
    () => !displayOptions.map((o) => o.value).includes(selectedDisplay),
    [selectedDisplay]
  );

  useEffect(() => {
    if (dimensions?.length === 0) {
      setDefaultDimensions();
    }
  }, [dimensions, resource, setDefaultDimensions]);

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex gap-4 items-center justify-end text-primary-7">
        <div className="flex gap-2 items-baseline mr-auto">
          <span className="font-bold text-xl">Simulations</span>
          <span className="text-xs">
            {simulations?.length ?? <Spin indicator={<LoadingOutlined />} />} simulations
          </span>
        </div>
        <div>
          <span className="mr-2 font-light text-primary-8">Show:</span>
          <SimulationOptionsDropdown
            options={showOnlyOptions}
            setSelectedValue={setShowStatus}
            selectedValue={showStatus}
          />
        </div>
        <div>
          <span className="mr-2 font-light text-primary-8">Display:</span>
          <SimulationOptionsDropdown
            setSelectedValue={setSelectedDisplay}
            selectedValue={selectedDisplay}
            options={[
              ...displayOptions,
              ...analyses.map((a) => ({ label: a.name, value: a['@id'] })),
            ]}
          />
          <Link href={`${path}/experiment-analysis`}>
            <PlusOutlined className="text-2xl ml-2 translate-y-[2px]" />
          </Link>
        </div>
      </div>
      {!isCustom && simulations && (
        <>
          <DimensionSelector coords={resource.parameter?.coords} />
          <SimulationsDisplayGrid display={selectedDisplay} status={showStatus} />
        </>
      )}

      {isCustom && (
        <CustomAnalysis resource={resource} analysisId={selectedDisplay} key={selectedDisplay} />
      )}
    </div>
  );
}
