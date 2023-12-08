import { useMemo, Dispatch, SetStateAction } from 'react';
import { useAtomValue } from 'jotai';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { getBottomUpPath, RegionFullPathType } from '@/util/brain-hierarchy';
import { brainRegionsFilteredTreeAtom, selectedBrainRegionAtom } from '@/state/brain-regions';

export default function CollapsedBrainRegionsSidebar({
  setIsCollapsed,
}: {
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}) {
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const brainRegions = useAtomValue(brainRegionsFilteredTreeAtom);

  const regionFullPath: RegionFullPathType[] = useMemo(
    () =>
      brainRegions && selectedBrainRegion
        ? getBottomUpPath(brainRegions, selectedBrainRegion.id)
        : [],
    [selectedBrainRegion, brainRegions]
  );

  const displaySubregions = [...regionFullPath].reverse();
  const selectedRegion = displaySubregions.shift();

  const subRegionsStr = displaySubregions.reduce(
    (acc, subregions) => `${acc}\u00A0\u00A0\u00A0${subregions.name}`,
    ''
  );

  return (
    <div className="flex flex-col items-center pt-2 w-[40px]">
      <Button
        className="mb-4"
        type="text"
        size="small"
        icon={<PlusOutlined style={{ color: 'white' }} />}
        onClick={() => setIsCollapsed(false)}
      />

      <div
        className="text-white flex gap-x-3.5 items-center max-h-[90vh]"
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          cursor: 'e-resize',
        }}
        role="presentation"
        onClick={() => setIsCollapsed(false)}
      >
        <div className="text-sm font-bold whitespace-nowrap">{selectedRegion?.name}</div>
        <div className="text-sm font-thin truncate">{subRegionsStr}</div>
        <div className="text-lg font-bold whitespace-nowrap">Brain region</div>
      </div>
    </div>
  );
}
