import VerticalSlidersPanel from './VerticalSlidersPanel';
import HorizontalSlidersPanel from './HorizontalSlidersPanel';

import styles from './distribution-sliders.module.scss';

export default function DistributionSliders() {
  return (
    <div className={styles.distributionSlidersPanel}>
      <div className={styles.verticalSlidersPanel}>
        <VerticalSlidersPanel />
      </div>
      <div className={styles.horizontalSlidersPanel}>
        <HorizontalSlidersPanel />
      </div>
    </div>
  );
}
