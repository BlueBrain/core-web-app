import { useAtomValue, useSetAtom } from 'jotai/react';
import { SwapOutlined } from '@ant-design/icons';
import brainAreaAtom from '@/state/connectome-editor/sidebar';
import { selectedPostBrainRegionsAtom, selectedPreBrainRegionsAtom } from '@/state/brain-regions';
import { classNames } from '@/util/utils';

export function BrainAreaSwitchWrapper({ children }: { children?: React.ReactNode }) {
  const setArea = useSetAtom(brainAreaAtom);
  const area = useAtomValue(brainAreaAtom);
  if (!area) return null;
  const opposite = (area_: 'pre' | 'post') => (area_ === 'post' ? 'pre' : 'post');
  return (
    <button
      type="button"
      className={classNames(
        'bg-neutral-7 p-2 relative rounded w-full',
        area === 'pre' ? 'text-highlightPost' : 'text-highlightPre'
      )}
      onClick={() => setArea(opposite(area))}
    >
      <div className="flex flex-col text-left">
        <div className="capitalize">{`${opposite(area)}-synaptic`}</div>
        <div className="flex flex-wrap gap-x-2 items-center justify-start">{children}</div>
      </div>
      <SwapOutlined className="absolute top-3 right-3" />
    </button>
  );
}

export default function BrainAreaSwitch() {
  const area = useAtomValue(brainAreaAtom);
  const preSynapticBrainRegions = useAtomValue(selectedPreBrainRegionsAtom);
  const postSynapticBrainRegions = useAtomValue(selectedPostBrainRegionsAtom);

  if (!area) return null;

  const brainRegions = area === 'pre' ? postSynapticBrainRegions : preSynapticBrainRegions;

  return (
    <BrainAreaSwitchWrapper>
      {brainRegions.map((br) => (
        <span className="text-white" key={br.id}>
          {br.title}
        </span>
      ))}
    </BrainAreaSwitchWrapper>
  );
}
