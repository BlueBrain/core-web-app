import { useAtom, useAtomValue } from 'jotai';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { loadable } from 'jotai/utils';
import { dataAtom, pageSizeAtom } from '@/state/ephys';
import styles from './loadmore-button.module.scss';

const antIcon = <LoadingOutlined style={{ float: 'left', fontSize: 24 }} spin />;

export default function LoadMoreButton() {
  const isLoaded = useAtomValue(loadable(dataAtom));
  const [pageSize, setPageSize] = useAtom(pageSizeAtom);
  return (
    <div className={styles.more}>
      <button type="button" onClick={() => setPageSize(pageSize + 30)}>
        {isLoaded.state === 'hasData' ? <>Load 30 more results...</> : <Spin indicator={antIcon} />}
      </button>
    </div>
  );
}
