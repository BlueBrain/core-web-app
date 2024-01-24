import { HTMLProps } from 'react';
import { useAtom } from 'jotai';
import { totalAtom, pageSizeAtom } from '@/state/explore-section/list-view-atoms';
import { classNames } from '@/util/utils';
import { ExploreDataBrainRegionSource } from '@/types/explore-section/application';
import { DataType, PAGE_SIZE } from '@/constants/explore-section/list-views';
import { useLoadableValue } from '@/hooks/hooks';

function Btn({ children, className, disabled, onClick }: HTMLProps<HTMLButtonElement>) {
  return (
    <button
      className={classNames('font-semibold mt-2 mx-auto px-14 py-4 rounded-3xl', className)}
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label="load-more-resources-button"
    >
      {children}
    </button>
  );
}

export default function LoadMoreButton({
  dataType,
  brainRegionSource,
}: HTMLProps<HTMLButtonElement> & {
  dataType: DataType;
  brainRegionSource: ExploreDataBrainRegionSource;
}) {
  const total = useLoadableValue(totalAtom({ dataType, brainRegionSource }));
  const [pageSize, setPageSize] = useAtom(pageSizeAtom);

  if (total.state === 'loading') return null;
  if (total.state === 'hasError') {
    return (
      <Btn className="bg-primary-8 cursor-progress text-white" disabled>
        <div>Data could not be fetched</div>
      </Btn>
    );
  }

  if (total.state === 'hasData' && pageSize > total.data) return null;

  return (
    <Btn className="bg-primary-8 text-white" onClick={() => setPageSize(pageSize + 30)}>
      <span>Load {PAGE_SIZE} more results...</span>
    </Btn>
  );
}
