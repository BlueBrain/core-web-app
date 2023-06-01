import { useAtomValue, useSetAtom } from 'jotai';
import { SwapOutlined } from '@ant-design/icons';
import brainAreaAtom from '@/state/connectome-editor/sidebar';
import { classNames } from '@/util/utils';

export default function BrainAreaSwitch() {
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
      <div className="flex flex-col text-left max-h-48 overflow-scroll">
        <div className="text-white">Switch to the </div>
        <div className="capitalize">{`${opposite(area)}-synaptic area`}</div>
      </div>
      <SwapOutlined className="absolute top-3 right-3" />
    </button>
  );
}
