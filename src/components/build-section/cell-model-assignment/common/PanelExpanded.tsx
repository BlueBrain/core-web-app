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
    <div className={classNames(className, 'mb-5 flex items-start justify-between')}>
      <div className="flex items-center justify-start space-x-2 text-2xl font-bold text-white">
        <BrainRegionIcon style={{ height: '1em' }} />
        <span className="text-[16px] text-secondary-4">{title ?? 'Select a region first'}</span>
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
  return !brainRegion.leaves;
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
        <div className="flex h-1/2 w-[90%] flex-col justify-center gap-10 self-center text-white">
          <div className="text-3xl">Not a leaf Brain Region</div>
          <div className="text-xl">To display the E-Types, select a leaf Brain Region</div>
        </div>
      );
    }
  }

  return (
    <div className="flex min-w-[300px] flex-1 flex-col overflow-y-auto py-6">
      <PanelTitle title={brainRegion?.title} onClick={handleClick} className="px-7" />
      {body}
    </div>
  );
}
