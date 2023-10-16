import { Button } from 'antd';
import { MinusOutlined } from '@ant-design/icons';
import { Dispatch, ElementType, SetStateAction, useCallback } from 'react';
import { useAtomValue } from 'jotai';

import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { BrainRegionIcon } from '@/components/icons';
import { classNames } from '@/util/utils';
import { SelectedBrainRegion } from '@/state/brain-regions/types';
import DefaultLoadingSuspense from '@/components/DefaultLoadingSuspense';

interface PanelTitleProps {
  title?: string;
  onClick: () => void;
  className?: string;
}

function PanelTitle({ title, onClick, className }: PanelTitleProps) {
  return (
    <div className={classNames(className, 'flex justify-between items-start mb-5')}>
      <div className="flex space-x-2 justify-start items-center text-2xl text-white font-bold">
        <BrainRegionIcon style={{ height: '1em' }} />
        <span className="text-secondary-4 text-[16px]">{title ?? 'Select a region first'}</span>
      </div>
      <Button
        type="text"
        icon={<MinusOutlined style={{ color: 'white' }} />}
        onClick={onClick}
        style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}
      />
    </div>
  );
}

function isLeafNode(brainRegion: SelectedBrainRegion) {
  return !brainRegion.leaves && brainRegion.representedInAnnotation;
}

interface PanelExpandedProps {
  setIsSidebarExpanded: Dispatch<SetStateAction<boolean>>;
  listComponent: ElementType;
}

export default function PanelExpanded({
  setIsSidebarExpanded,
  listComponent: ListComponent,
}: PanelExpandedProps) {
  const brainRegion = useAtomValue(selectedBrainRegionAtom);

  const handleClick = useCallback(() => setIsSidebarExpanded(false), [setIsSidebarExpanded]);

  let body = null;
  if (brainRegion) {
    if (isLeafNode(brainRegion)) {
      body = (
        <DefaultLoadingSuspense>
          <ListComponent />
        </DefaultLoadingSuspense>
      );
    } else {
      body = (
        <div className="self-center flex flex-col justify-center gap-10 w-[90%] text-white h-1/2">
          <div className="text-3xl">Not a leaf Brain Region</div>
          <div className="text-xl">To display the E-Types, select a leaf Brain Region</div>
        </div>
      );
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto py-6 min-w-[300px]">
      <PanelTitle title={brainRegion?.title} onClick={handleClick} className="px-7" />
      {body}
    </div>
  );
}
