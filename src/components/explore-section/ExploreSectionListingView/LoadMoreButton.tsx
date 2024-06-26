import { HTMLProps } from 'react';
import { useAtom } from 'jotai';
import { totalAtom, pageSizeAtom } from '@/state/explore-section/list-view-atoms';
import { classNames } from '@/util/utils';
import { ExploreDataBrainRegionSource } from '@/types/explore-section/application';
import { DataType, PAGE_SIZE } from '@/constants/explore-section/list-views';
import { useLoadableValue } from '@/hooks/hooks';
import { BookmarkScope } from '@/state/virtual-lab/bookmark';

function Btn({ children, className, disabled, onClick }: HTMLProps<HTMLButtonElement>) {
  return (
    <button
      className={classNames('mx-auto rounded-full px-12 py-3 font-normal', className)}
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
  bookmarkScope,
  hide,
}: HTMLProps<HTMLButtonElement> & {
  dataType: DataType;
  brainRegionSource: ExploreDataBrainRegionSource;
  bookmarkScope?: BookmarkScope;
  hide: () => void;
}) {
  const total = useLoadableValue(totalAtom({ dataType, brainRegionSource, bookmarkScope }));
  const [contentSize, setContentSize] = useAtom(pageSizeAtom);

  const onLoadMore = () => {
    setContentSize(contentSize + PAGE_SIZE);
    hide();
  };

  if (total.state === 'loading') return null;
  if (total.state === 'hasError') {
    return (
      <Btn className="cursor-progress bg-primary-8 text-white" disabled>
        <div>Data could not be fetched</div>
      </Btn>
    );
  }

  if (total.state === 'hasData' && contentSize > total.data) return null;

  return (
    <Btn className="bg-primary-8 text-white" onClick={onLoadMore}>
      <span>Load {PAGE_SIZE} more results...</span>
    </Btn>
  );
}
