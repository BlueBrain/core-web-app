import { useMemo } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Loadable } from 'jotai/vanilla/utils/loadable';
import { Spin } from 'antd';
import { ExploreSectionResource, TotalHits } from '@/types/explore-section';
import styles from '@/components/explore-section/EphysViewerContainer/styles/loadmore-button.module.scss';

const antIcon = <LoadingOutlined style={{ float: 'left', fontSize: 24 }} spin />;

type LoadMoreButtonPros = {
  data: Loadable<ExploreSectionResource[] | undefined>;
  onClick: () => void;
  total: Loadable<TotalHits | undefined>;
};

export default function LoadMoreButton({ data, onClick, total }: LoadMoreButtonPros) {
  // whether or not all resources are loaded

  // whether or not all resources are loaded
  const allLoaded = useMemo(
    () =>
      data.state === 'hasData' &&
      total.state === 'hasData' &&
      total.data?.value === data.data?.length,
    [data, total]
  );

  return allLoaded ? (
    <>All resources are loaded</>
  ) : (
    <div className={styles.more}>
      <button type="button" onClick={onClick}>
        {data.state === 'loading' ? <Spin indicator={antIcon} /> : <>Load 30 more results...</>}
      </button>
    </div>
  );
}
