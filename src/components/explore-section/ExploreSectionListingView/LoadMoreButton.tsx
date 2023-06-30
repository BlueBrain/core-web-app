import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import styles from '@/components/explore-section/EphysViewerContainer/styles/loadmore-button.module.scss';

const antIcon = <LoadingOutlined style={{ float: 'left', fontSize: 24 }} spin />;

type LoadMoreButtonPros = {
  onClick: () => void;
  isLoading: boolean;
  allLoaded: boolean;
};

export default function LoadMoreButton({ onClick, isLoading, allLoaded }: LoadMoreButtonPros) {
  return allLoaded ? (
    <>All resources are loaded</>
  ) : (
    <div className={styles.more}>
      <button type="button" onClick={onClick}>
        {isLoading ? <Spin indicator={antIcon} /> : <>Load 30 more results...</>}
      </button>
    </div>
  );
}
