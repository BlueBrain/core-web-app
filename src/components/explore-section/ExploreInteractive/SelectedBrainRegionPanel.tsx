'use client';

import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { useMemo } from 'react';
import { ConfigProvider, Tabs } from 'antd';
import { ExperimentsTotals } from './ExperimentsTotals';
import { LiteratureForExperimentType } from './LiteratureForExperimentType';
import { brainRegionsAtom, selectedBrainRegionAtom } from '@/state/brain-regions';

export default function SelectedBrainRegionPanel() {
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const brainRegions = useAtomValue(useMemo(() => unwrap(brainRegionsAtom), []));
  const selected = brainRegions?.find((brainRegion) => brainRegion.id === selectedBrainRegion?.id);

  return (
    selected && (
      <div className="absolute bottom-0 bg-[#000000b3] z-10 w-full px-10 min-h-[200px]">
        <div className="flex">
          <ConfigProvider
            theme={{
              components: {
                Tabs: {
                  itemSelectedColor: '#FFF',
                  itemColor: '#FFF',
                  inkBarColor: '#FFF',
                },
              },
            }}
          >
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: '1',
                  label: 'Experiment data',
                  children: <ExperimentsTotals />,
                },
                {
                  key: '2',
                  label: 'Literature',
                  children: <LiteratureForExperimentType brainRegions={[selected]} />,
                },
              ]}
            />
          </ConfigProvider>
        </div>
      </div>
    )
  );
}
