import { HTMLProps, useMemo } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useAtomValue, useAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { totalAtom, pageSizeAtom } from '@/state/explore-section/list-view-atoms';
import { classNames } from '@/util/utils';
import { ExploreDataBrainRegionSource } from '@/types/explore-section/application';

const antIcon = <LoadingOutlined style={{ float: 'left', fontSize: 24 }} spin />;

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
  experimentTypeName,
  brainRegionSource,
}: HTMLProps<HTMLButtonElement> & {
  experimentTypeName: string;
  brainRegionSource: ExploreDataBrainRegionSource;
}) {
  const total = useAtomValue(
    useMemo(
      () => loadable(totalAtom({ experimentTypeName, brainRegionSource })),
      [brainRegionSource, experimentTypeName]
    )
  );

  const [pageSize, setPageSize] = useAtom(pageSizeAtom);

  if (total.state === 'loading') {
    return (
      <Btn className="bg-primary-8 cursor-progress text-white" disabled>
        <Spin indicator={antIcon} />
      </Btn>
    );
  }
  if (total.state === 'hasError') {
    return (
      <Btn className="bg-primary-8 cursor-progress text-white" disabled>
        <div>Data could not be fetched</div>
      </Btn>
    );
  }

  const disabled = !!total.data && pageSize > total.data;

  return !disabled ? (
    <Btn className="bg-primary-8 text-white" onClick={() => setPageSize(pageSize + 30)}>
      {!!total.data && pageSize < total.data
        ? 'Load 30 more results...'
        : 'All resources are loaded'}
    </Btn>
  ) : (
    <Btn className="bg-neutral-2 cursor-not-allowed text-primary-9" disabled>
      {!!total.data && pageSize < total.data
        ? 'Load 30 more results...'
        : 'All resources are loaded'}
    </Btn>
  );
}
