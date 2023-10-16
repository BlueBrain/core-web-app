'use client';

import { useAtomValue } from 'jotai';
import { ConfigProvider, Tabs } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { unwrap } from 'jotai/utils';
import { BrainRegionExperimentsCount } from './BrainRegionExperimentsCount';
import { BrainRegionTabLabel } from './BrainRegionTabLabel';
import { LiteratureForExperimentType } from './LiteratureForExperimentType';
import { visibleExploreBrainRegionsAtom } from '@/state/explore-section/interactive';
import { brainRegionsAtom, selectedBrainRegionAtom } from '@/state/brain-regions';
import { BrainRegion } from '@/types/ontologies';

export const defaultTabColor = '#ffffff';

export default function SelectedBrainRegionPanel() {
  const visualizedBrainRegions = useAtomValue(visibleExploreBrainRegionsAtom);
  const brainRegions = useAtomValue(useMemo(() => unwrap(brainRegionsAtom), []));
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const visualizedBrainRegionDetails = visualizedBrainRegions.reduce<BrainRegion[]>(
    (acc, selectedRegion) => {
      const selected = brainRegions?.find((brainRegion) => brainRegion.id === selectedRegion);

      return selected ? [...acc, selected] : acc;
    },
    []
  );

  /**
   * The default active brain region is decided in the following order.
   *
   * If a brain region is selected, then this becomes the active brain region
   * If there are visualized brain region, the first one becomes the active brain region
   * If none of the above is true, return undefined
   */
  const defaultActiveBrainRegion = () => {
    const selectedBr = brainRegions?.find((br) => br.id === selectedBrainRegion?.id);
    if (selectedBr && visualizedBrainRegions.includes(selectedBr.id)) {
      return selectedBr;
    }
    if (visualizedBrainRegionDetails.length > 0) {
      return visualizedBrainRegionDetails?.[0];
    }
    return undefined;
  };

  // the currently active brain region. Initializing with the first one (if exists) or undefined
  const [activeBrainRegion, setActiveBrainRegion] = useState<BrainRegion | undefined>(
    defaultActiveBrainRegion
  );

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
            children: (
              <div className="flex">
                <BrainRegionExperimentsCount brainRegion={brainRegion} />
                <LiteratureForExperimentType brainRegion={brainRegion} />
              </div>
            ),
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
