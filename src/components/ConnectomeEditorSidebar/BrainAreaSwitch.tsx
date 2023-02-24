import { useCallback, useMemo } from 'react';
import { useAtomValue, useSetAtom } from 'jotai/react';
import { Button } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import brainAreaAtom, { BrainArea } from '@/state/connectome-editor/sidebar';
import { selectedPostBrainRegionsAtom, selectedPreBrainRegionsAtom } from '@/state/brain-regions';
import { classNames } from '@/util/utils';

export default function BrainAreaSwitch({ area }: { area: BrainArea }) {
  const setArea = useSetAtom(brainAreaAtom);
  const preSynapticBrainRegions = useAtomValue(selectedPreBrainRegionsAtom);
  const postSynapticBrainRegions = useAtomValue(selectedPostBrainRegionsAtom);

  const brainRegions = area === 'pre' ? postSynapticBrainRegions : preSynapticBrainRegions;

  const displayedRegions = useMemo(
    () =>
      brainRegions.map((br) => (
        <span className="text-white" key={br.title}>
          {br.title}
        </span>
      )),
    [brainRegions]
  );

  const opposite = useCallback((area_: 'pre' | 'post') => (area_ === 'post' ? 'pre' : 'post'), []);

  return area && (
    <Button
      className={classNames(
        'bg-neutral-7 flex h-auto items-center justify-between p-2 rounded',
        area === 'pre' ? 'text-highlightPost' : 'text-highlightPre'
      )}
      onClick={() => setArea(opposite(area))}
    >
      <div className="flex flex-col text-left">
        <div className="capitalize">{`${opposite(area)}-synaptic`}</div>
        <div className="flex flex-wrap gap-x-2 items-center justify-start">{displayedRegions}</div>
      </div>
      <SwapOutlined />
    </Button>
  );
}
