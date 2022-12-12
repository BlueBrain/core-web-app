import React, { useMemo } from 'react';
import { useAtom } from 'jotai';
import HorizontalSlider from './HorizontalSlider';
import useDistributionSliders from '@/services/distribution-sliders/use-distribution-sliders';
import { targetsSeriesAtom } from '@/state/density-editor';

import styles from './horizontal-sliders-panel.module.scss';

export default function HorizontalSlidersPanel() {
  const [series, setSeries] = useAtom(targetsSeriesAtom);
  const { recalculatePercentages, toggleLockSlider } = useDistributionSliders(series, setSeries);

  const sliderComponents = useMemo(
    () =>
      series.map((seriesItem) => (
        <HorizontalSlider
          seriesItem={seriesItem}
          key={seriesItem.label}
          onChange={recalculatePercentages}
          onAfterChange={recalculatePercentages}
          onToggleLockSlider={toggleLockSlider}
        />
      )),
    [recalculatePercentages, series, toggleLockSlider]
  );

  const targetCountDisplay = useMemo(
    () => `${series.length} target${series.length !== 1 ? `s` : ``}`,
    [series.length]
  );

  return (
    <div className={styles.horizontalSlidersPanel}>
      <div className={styles.panelHeader}>
        BREAKDOWN <span className={styles.panelHeaderTargets}>({targetCountDisplay})</span>
      </div>
      <div className={styles.sliderComponents}>{sliderComponents}</div>
    </div>
  );
}
