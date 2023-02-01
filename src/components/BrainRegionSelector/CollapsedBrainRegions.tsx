import React, { useMemo, Dispatch, SetStateAction } from 'react';
import { useAtomValue } from 'jotai/react';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { classNames } from '@/util/utils';
import { getBottomUpPath, RegionFullPathType } from '@/util/brain-hierarchy';
import { brainRegionsAtom, brainRegionIdAtom } from '@/state/brain-regions';

export default function CollapsedBrainRegionsSidebar({
  setIsRegionSelectorOpen,
}: {
  setIsRegionSelectorOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const brainRegionId = useAtomValue(brainRegionIdAtom);
  const brainRegions = useAtomValue(brainRegionsAtom);

  const regionFullPath: RegionFullPathType[] = useMemo(
    () => (brainRegions && brainRegionId ? getBottomUpPath(brainRegions, brainRegionId) : []),
    [brainRegionId, brainRegions]
  );

  // default or if only 'Whole mouse brain selected' discard it.
  if (!regionFullPath.length || regionFullPath.length === 1) {
    return <div className="text-lg font-bold">Brain region</div>;
  }

  // remove 'Whole mouse brain'
  let [, ...displaySubregions] = [...regionFullPath];
  displaySubregions.reverse();

  // if path is too long, make it short with ...
  if (displaySubregions.length > 4) {
    const reducedSubregions = [...displaySubregions].slice(0, 4);
    displaySubregions = [...reducedSubregions, { id: 'dots', name: '...' }];
  }

  // highlight the last element in path (more nested selection)
  const highlightElemId = displaySubregions[0].id;

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
        onClick={() => setIsRegionSelectorOpen(true)}
      />

      <div
        className="text-white flex gap-x-3.5 items-center"
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          cursor: 'e-resize',
        }}
        role="presentation"
        onClick={() => setIsRegionSelectorOpen(true)}
      >
        {subRegionElems}
        <div className="text-lg font-bold">Brain region</div>
      </div>
    </div>
  );
}
