'use client';

import { useAtomValue } from 'jotai';
import { ConfigProvider, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { BrainRegionExperimentsCount } from './BrainRegionExperimentsCount';
import { BrainRegionTabLabel } from './BrainRegionTabLabel';
import { visibleExploreBrainRegionsAtom } from '@/state/explore-section/interactive';
import { brainRegionsAtom } from '@/state/brain-regions';
import { BrainRegion } from '@/types/ontologies';

const defaultTabColor = '#ffffff';

export default function SelectedBrainRegionPanel() {
  const visualizedBrainRegions = useAtomValue(visibleExploreBrainRegionsAtom);
  const brainRegions = useAtomValue(brainRegionsAtom);

  const visualizedBrainRegionDetails = visualizedBrainRegions.reduce<BrainRegion[]>(
    (acc, selectedRegion) => {
      const selected = brainRegions?.find((brainRegion) => brainRegion.id === selectedRegion);

      return selected ? [...acc, selected] : acc;
    },
    []
  );

  const [activeBrainRegion, setActiveBrainRegion] = useState<BrainRegion | undefined>(undefined);

  useEffect(() => {
    // if there is only one visualized brain region or if the current active brain region
    // is not part of the visualized brain region (meaning that it was removed)
    // then the active brain region is initialized
    if (
      visualizedBrainRegionDetails.length === 1 ||
      (activeBrainRegion && !visualizedBrainRegions.includes(activeBrainRegion.id))
    ) {
      setActiveBrainRegion(visualizedBrainRegionDetails.reverse()[0]);
    }
  }, [activeBrainRegion, visualizedBrainRegionDetails, visualizedBrainRegions]);

  return visualizedBrainRegionDetails.length > 0 && activeBrainRegion ? (
    <div className="absolute bottom-0 bg-[#000000b3] z-10 w-full text-white px-10 min-h-[200px]">
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              itemColor: defaultTabColor,
              inkBarColor: activeBrainRegion.colorCode,
              itemSelectedColor: activeBrainRegion.colorCode,
            },
          },
        }}
      >
        <Tabs
          items={visualizedBrainRegionDetails.map((brainRegion) => ({
            label: (
              <BrainRegionTabLabel
                brainRegion={brainRegion}
                isActive={brainRegion.id === activeBrainRegion.id}
              />
            ),
            key: brainRegion.id,
            children: <BrainRegionExperimentsCount brainRegion={brainRegion} />,
            className: 'hover:text-red',
          }))}
          className="font-bold"
          activeKey={activeBrainRegion.id}
          tabBarStyle={{ borderBottom: '1px solid #595959' }}
          onTabClick={(key) => {
            const brainRegion = visualizedBrainRegionDetails.find((br) => br.id === key);

            if (brainRegion) {
              setActiveBrainRegion(brainRegion);
            }
          }}
        />
      </ConfigProvider>
    </div>
  ) : null;
}
