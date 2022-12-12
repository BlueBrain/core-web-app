import React, { useMemo } from 'react';
import { useAtom } from 'jotai';
import VerticalSlider from './VerticalSlider';
import useDistributionSliders from '@/services/distribution-sliders/use-distribution-sliders';
import { seriesAtom } from '@/state/density-editor';

import styles from './vertical-sliders-panel.module.scss';

export default function VerticalSlidersPanel() {
  const [series, setSeries] = useAtom(seriesAtom);
  const { recalculatePercentages, toggleLockSlider, selectedSeriesLabel } = useDistributionSliders(
    series,
    setSeries
  );

  const sliderComponents = useMemo(
    () =>
      series.map((seriesItem) => (
        <VerticalSlider
          seriesItem={seriesItem}
          key={seriesItem.label}
          onChange={recalculatePercentages}
          onAfterChange={recalculatePercentages}
          isSelected={seriesItem.label === selectedSeriesLabel}
          onToggleLockSlider={toggleLockSlider}
        />
      )),
    [series, recalculatePercentages, selectedSeriesLabel, toggleLockSlider]
  );

  return <div className={styles.verticalSlidersPanel}>{sliderComponents}</div>;
}
