import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { PrimitiveAtom, useAtom } from 'jotai';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import { useMemo } from 'react';
import { ExploreSectionResource, TotalHits } from '@/types/explore-section';
import styles from '@/components/explore-section/EphysViewerContainer/styles/loadmore-button.module.scss';

const antIcon = <LoadingOutlined style={{ float: 'left', fontSize: 24 }} spin />;

type LoadMoreButtonPros = {
  dataState: Loadable<Promise<ExploreSectionResource[] | undefined>>;
  pageSizeAtom: PrimitiveAtom<number>;
  totalState: Loadable<Promise<TotalHits | undefined>>;
};

export default function LoadMoreButton({
  dataState,
  pageSizeAtom,
  totalState,
}: LoadMoreButtonPros) {
  const [pageSize, setPageSize] = useAtom(pageSizeAtom);

  // whether or not all resources are loaded
  const allLoaded = useMemo(
    () =>
      dataState.state === 'hasData' &&
      totalState.state === 'hasData' &&
      totalState.data?.value === dataState.data?.length,
    [dataState, totalState]
  );

  // the content to be displayed in the button
  const content = useMemo(() => {
    if (allLoaded) {
      return <>All resources are loaded</>;
    }
    if (dataState.state === 'loading') {
      return <Spin indicator={antIcon} />;
    }
    return <>Load 30 more results...</>;
  }, [allLoaded, dataState.state]);

  return (
    <div className={styles.more}>
      <button disabled={allLoaded} type="button" onClick={() => setPageSize(pageSize + 30)}>
        {content}
      </button>
    </div>
  );
}
