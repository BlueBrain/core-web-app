import { BrainArea } from '@/state/connectome-editor/sidebar';
import { classNames } from '@/util/utils';

type Props = {
  regions: Map<string, string>;
  area: BrainArea;
};

export default function BrainRegionSelection({ regions, area }: Props) {
  const textColor = area === 'pre' ? 'text-highlightPre' : 'text-highlightPost';
  const title = area === 'pre' ? 'Pre-synaptic' : 'Post-synaptic';

  return (
    <div>
      <div className={classNames('text-lg mr-3', textColor)}>{title}</div>

      {regions.size !== 0 && <div>{Array.from(regions.values()).join(', ')}</div>}
    </div>
  );
}
