import { useAtomValue } from 'jotai';
import { loadable, unwrap } from 'jotai/utils';
import { useMemo } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { METypeDetails } from './METypeDetails';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { analysedCompositionAtom } from '@/state/build-composition';
import { classNames } from '@/util/utils';
import { cellTypesByIdAtom } from '@/state/build-section/cell-types';

export default function SelectedBrainRegionMETypes() {
  const brainRegion = useAtomValue(selectedBrainRegionAtom);
  const composition = useAtomValue(useMemo(() => loadable(analysedCompositionAtom), []));
  const meTypesMetadata = useAtomValue(useMemo(() => unwrap(cellTypesByIdAtom), []));

  if (!brainRegion) {
    return null;
  }

  if (composition.state === 'loading') {
    return (
      <div
        className={classNames('flex h-full w-full items-center justify-center bg-black text-white')}
      >
        <LoadingOutlined />
      </div>
    );
  }

  if (composition.state === 'hasError') {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black text-white">
        Composition could not be calculated
      </div>
    );
  }

  return composition.data ? (
    <div className="flex h-full w-full min-w-[300px] flex-col gap-5 bg-black p-8 pb-0 text-white">
      <METypeDetails composition={composition.data} meTypesMetadata={meTypesMetadata} />
    </div>
  ) : (
    <div className="flex w-[300px] flex-col gap-5 overflow-y-auto p-10">
      Composition could not be calculated
    </div>
  );
}
