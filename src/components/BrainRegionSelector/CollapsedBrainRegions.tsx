import React, { useMemo, Dispatch, SetStateAction } from 'react';
import { useAtomValue } from 'jotai/react';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { classNames } from '@/util/utils';
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

  // remove 'Whole mouse brain'
  let [, ...displaySubregions] = [...regionFullPath];
  displaySubregions.reverse();

  // if path is too long, make it short with ...
  if (displaySubregions.length > 4) {
    const reducedSubregions = [...displaySubregions].slice(0, 4);
    displaySubregions = [...reducedSubregions, { id: 'dots', name: '...' }];
  }

  // highlight the last element in path (more nested selection)
  // with optional chaining, allow subRegionElems to be empty array
  const highlightElemId = displaySubregions[0]?.id;

  const subRegionElems = displaySubregions.map((subregions) => (
    <div
      key={subregions.id}
      className={classNames(
        'text-sm',
        subregions.id === highlightElemId ? 'font-bold' : 'font-thin'
      )}
    >
      {subregions.name}
    </div>
  ));

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
        className="text-white flex gap-x-3.5 items-center"
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          cursor: 'e-resize',
        }}
        role="presentation"
        onClick={() => setIsCollapsed(false)}
      >
        {subRegionElems}
        <div className="text-lg font-bold">Brain region</div>
      </div>
    </div>
  );
}
