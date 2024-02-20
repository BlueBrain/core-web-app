'use client';

import { DataTypeTabs, DataTypeStatPanel } from '@/components/explore-section/ExploreInteractive';
import SelectedBrainRegionMETypes from '@/components/explore-section/ExploreInteractive/SelectedBrainRegionMETypes';
import ThreeDeeBrain from '@/components/ThreeDeeBrain';
import { classNames } from '@/util/utils';

export default function InteractivePage() {
  return (
    <div className="relative min-h-0 min-w-0 overflow-hidden">
      <div
        id="interactive-layout"
        className={classNames(
          'h-full gap-y-4 bg-black',
          'grid grid-cols-[repeat(4,1fr)] grid-rows-[80px,repeat(4,1fr),minmax(80px,max-content)]'
        )}
      >
        <div id="interactive-header" style={{ gridArea: '1 / 1 / 2 / 6' }}>
          <DataTypeTabs />
        </div>
        <div
          id="neurons-panel"
          className="relative ml-4 mr-2 rounded-md"
          style={{ gridArea: '2 / 1 / 6 / 3' }}
        >
          <SelectedBrainRegionMETypes />
        </div>
        <div
          id="3d-area"
          className="3d relative ml-2 mr-4 h-full rounded-md border border-neutral-4 p-1"
          style={{ gridArea: '2 / 3 / 6 / 6' }}
        >
          <ThreeDeeBrain />
        </div>
        <div id="statistic-panel" style={{ gridArea: '6 / 1 / 7 / 5' }}>
          <DataTypeStatPanel />
        </div>
      </div>
    </div>
  );
}
