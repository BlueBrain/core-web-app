import { useAtomValue, useSetAtom } from 'jotai/react';
import { SwapOutlined } from '@ant-design/icons';
import brainAreaAtom, { BrainArea } from '@/state/connectome-editor/sidebar';
import { selectedPostBrainRegionsAtom, selectedPreBrainRegionsAtom } from '@/state/brain-regions';

export default function BrainAreaSwitch({ area }: { area: BrainArea }) {
  const setArea = useSetAtom(brainAreaAtom);
  const preSynapticBrainRegions = useAtomValue(selectedPreBrainRegionsAtom);
  const postSynapticBrainRegions = useAtomValue(selectedPostBrainRegionsAtom);

  if (!area) return null;

  const brainRegions = area === 'pre' ? postSynapticBrainRegions : preSynapticBrainRegions;

  const opposite = (area_: 'pre' | 'post') => (area_ === 'post' ? 'pre' : 'post');

  return (
    <div
      className={`bg-neutral-7 ${
        area === 'pre' ? 'text-highlightPost' : 'text-highlightPre'
      } p-2 rounded flex justify-between`}
    >
      <div>
        <span className="capitalize">{`${opposite(area)}-synaptic`}</span>
        <span className="inline-block text-white">
          {brainRegions.map((br) => (
            <span className="inline-block mr-2" key={br.title}>
              {br.title}
            </span>
          ))}
        </span>
      </div>
      <SwapOutlined className="" onClick={() => setArea(opposite(area))} />
    </div>
  );
}
