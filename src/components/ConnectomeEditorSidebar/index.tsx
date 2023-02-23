import { useMemo } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useSetAtom, useAtomValue } from 'jotai/react';
import { ExpandedBrainRegionsSidebar } from '../BrainRegionSelector/BrainRegions';
import brainAreaAtom from '@/state/connectome-editor/sidebar';

import {
  setSelectedPostBrainRegionAtom,
  setSelectedPreBrainRegionAtom,
  selectedPreBrainRegionIdsAtom,
  selectedPostBrainRegionIdsAtom,
  brainRegionsFilteredTreeAtom,
} from '@/state/brain-regions';

export default function ConnectomeEditorSidebar() {
  const area = useAtomValue(brainAreaAtom);
  const setArea = useSetAtom(brainAreaAtom);
  const setSelectedPreBrainRegion = useSetAtom(setSelectedPreBrainRegionAtom);
  const setSelectedPostBrainRegion = useSetAtom(setSelectedPostBrainRegionAtom);
  const preSynapticBrainRegions = useAtomValue(selectedPreBrainRegionIdsAtom);
  const postSynapticBrainRegions = useAtomValue(selectedPostBrainRegionIdsAtom);
  const tree = useAtomValue(brainRegionsFilteredTreeAtom);

  const header = (jsx: React.ReactNode) => (
    <div className="flex flex-col">
      <div className="text-base font-thin">Select the</div>
      {jsx}
    </div>
  );

  const [topSelectedPreRegion, topSelectedPostRegion]: [string, string] = useMemo(() => {
    function findTopSelectedRegion(selectedIds: Set<string>) {
      // Finds the selected brain regions closest to the root of the tree

      const queue = [...(tree ?? [])];
      while (queue.length) {
        const region = queue.shift();
        if (region && selectedIds.has(region.id)) return region.title;
        region?.items?.forEach((r) => queue.push(r));
      }
      return '';
    }

    return [
      findTopSelectedRegion(preSynapticBrainRegions),
      findTopSelectedRegion(postSynapticBrainRegions),
    ];
  }, [preSynapticBrainRegions, postSynapticBrainRegions, tree]);

  return (
    <div className="bg-black flex flex-1 flex-col h-screen">
      {!area && (
        <div className="flex flex-col items-center pt-2 w-[40px]">
          <Button
            className="mb-4"
            type="text"
            size="small"
            icon={<PlusOutlined style={{ color: 'white' }} />}
            onClick={() => setArea('pre')}
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
              onClick={() => setArea('post')}
              role="presentation"
            >
              Post-synaptic{' '}
              <span className="text-highlightPost capitalize">
                {topSelectedPostRegion || 'Brain'}
              </span>
            </div>
            <div
              className="text-lg cursor-pointer"
              onClick={() => setArea('pre')}
              role="presentation"
            >
              Pre-synaptic{' '}
              <span className="text-highlightPre capitalize">
                {topSelectedPreRegion || 'Brain'}
              </span>
            </div>
          </div>
        </div>
      )}

      {!!area && (
        <ExpandedBrainRegionsSidebar
          setIsRegionSelectorOpen={(value: boolean) => {
            if (!value) setArea(null);
          }}
          header={
            area === 'post'
              ? header(<div className="text-[#FF4D4F] text-xl">Post-synaptic area</div>)
              : header(<div className="text-[#40A9FF] text-xl">Pre-synaptic area</div>)
          }
          setSelectedBrainRegion={
            area === 'post' ? setSelectedPostBrainRegion : setSelectedPreBrainRegion
          }
          area={area}
          selectedPreBrainRegionIds={preSynapticBrainRegions}
          selectedPostBrainRegionIds={postSynapticBrainRegions}
        />
      )}
    </div>
  );
}
