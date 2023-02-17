import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useSetAtom, useAtomValue } from 'jotai/react';
import { useState } from 'react';
import { ExpandedBrainRegionsSidebar } from '../BrainRegionSelector/BrainRegions';
import {
  setSelectedPostBrainRegionAtom,
  setSelectedPreBrainRegionAtom,
  selectedPreBrainRegionIdsAtom,
  selectedPostBrainRegionIdsAtom,
} from '@/state/brain-regions';

export default function BrainRegionSelector() {
  const [selectedSide, setSelectedSide] = useState<'' | 'pre' | 'post'>('');
  const setSelectedPreBrainRegion = useSetAtom(setSelectedPreBrainRegionAtom);
  const setSelectedPostBrainRegion = useSetAtom(setSelectedPostBrainRegionAtom);
  const preSynapticBrainRegions = useAtomValue(selectedPreBrainRegionIdsAtom);
  const postSynapticBrainRegions = useAtomValue(selectedPostBrainRegionIdsAtom);
  return (
    <div className="bg-black flex flex-1 flex-col h-screen">
      {!selectedSide && (
        <div className="flex flex-col items-center pt-2 w-[40px]">
          <Button
            className="mb-4"
            type="text"
            size="small"
            icon={<PlusOutlined style={{ color: 'white' }} />}
            onClick={() => setSelectedSide('pre')}
          />

          <div
            className="flex gap-x-3.5 items-center"
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              color: '#8c8c8c',
            }}
            role="presentation"
          >
            <div
              className="text-lg mb-10 cursor-pointer"
              onClick={() => setSelectedSide('post')}
              role="presentation"
            >
              Post-synaptic <span className="text-[#FF4D4F]">Brain</span>
            </div>
            <div
              className="text-lg cursor-pointer"
              onClick={() => setSelectedSide('pre')}
              role="presentation"
            >
              Pre-synaptic <span className="text-[#40A9FF]">Brain</span>
            </div>
          </div>
        </div>
      )}

      {!!selectedSide && (
        <ExpandedBrainRegionsSidebar
          setIsRegionSelectorOpen={(value: boolean) => {
            if (!value) setSelectedSide('');
          }}
          header={
            selectedSide === 'post' ? 'Post-synaptic Brain Region ' : 'Pre-synaptic Brain Region'
          }
          setSelectedBrainRegion={
            selectedSide === 'post' ? setSelectedPostBrainRegion : setSelectedPreBrainRegion
          }
          selectedBrainRegionIds={
            selectedSide === 'post' ? postSynapticBrainRegions : preSynapticBrainRegions
          }
        />
      )}
    </div>
  );
}
