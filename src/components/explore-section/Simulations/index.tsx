import { Space } from 'antd';
import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { SimulationCampaignResource } from '@/types/explore-section/resources';
import DisplayDropdown from '@/components/explore-section/Simulations/DisplayDropdown';
import DimensionSelector from '@/components/explore-section/Simulations/DimensionSelector';
import SimulationsDisplayGrid from '@/components/explore-section/Simulations/SimulationsDisplayGrid';
import { initializeDimensionsAtom } from '@/components/explore-section/Simulations/state';

export default function Simulations({ resource }: { resource: SimulationCampaignResource }) {
  const [selectedDisplay, setSelectedDisplay] = useState('raster');
  const setDefaultDimensions = useSetAtom(initializeDimensionsAtom);

  useEffect(() => {
    setDefaultDimensions();
  }, [resource, setDefaultDimensions]);
  return (
    <div className="mt-5">
      <div className="grid grid-cols-2">
        <div className="text-primary-7">
          <Space>
            <span className="font-bold text-xl">Simulations</span>
            <span className="text-xs">4200 simulations</span>
          </Space>
        </div>
        <div>
          <Space className="float-right">
            <span className="text-neutral-4">Display:</span>
            <DisplayDropdown
              setSelectedDisplay={setSelectedDisplay}
              selectedDisplay={selectedDisplay}
            />
          </Space>
        </div>
      </div>
      <DimensionSelector />
      <div className="mt-4">
        <SimulationsDisplayGrid display={selectedDisplay} />
      </div>
    </div>
  );
}
