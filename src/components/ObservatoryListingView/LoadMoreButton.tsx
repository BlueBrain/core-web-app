import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { PrimitiveAtom, useAtom } from 'jotai';
import styles from '@/components/observatory/ephys/loadmore-button.module.scss';

const antIcon = <LoadingOutlined style={{ float: 'left', fontSize: 24 }} spin />;

type LoadMoreButtonPros = {
  isLoadedState: string;
  pageSizeAtom: PrimitiveAtom<number>;
};

export default function LoadMoreButton({ isLoadedState, pageSizeAtom }: LoadMoreButtonPros) {
  const [pageSize, setPageSize] = useAtom(pageSizeAtom);

  return (
    <div className={styles.more}>
      <button type="button" onClick={() => setPageSize(pageSize + 30)}>
        {isLoadedState === 'hasData' ? <>Load 30 more results...</> : <Spin indicator={antIcon} />}
      </button>
    </div>
  );
}
