import { Input, Slider } from 'antd';
import React, { ChangeEvent, useCallback, useMemo } from 'react';
import { DistributionSliderSeries } from '@/services/distribution-sliders/types';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import round from '@/services/distribution-sliders/round';
import IconButton from '@/components/IconButton';
import LockIcon from '@/components/icons/LockIcon';
import LockOpenIcon from '@/components/icons/LockOpenIcon';

import styles from './horizontal-slider.module.scss';

interface HorizontalSliderProps {
  seriesItem: DistributionSliderSeries;
  onChange: (value: number, seriesItem: DistributionSliderSeries) => void;
  onAfterChange: (value: number, seriesItem: DistributionSliderSeries) => void;
  onToggleLockSlider: (seriesItem: DistributionSliderSeries) => void;
}

export default function HorizontalSlider({
  onToggleLockSlider,
  seriesItem,
  onChange,
  onAfterChange,
}: HorizontalSliderProps) {
  const handleChange = useCallback(
    (value: number) => {
      onChange(value, seriesItem);
    },
    [onChange, seriesItem]
  );

  const handleAfterChange = useCallback(
    (value: number) => {
      onAfterChange(value, seriesItem);
    },
    [onAfterChange, seriesItem]
  );

  const handleToggleLockSlider = useCallback(() => {
    onToggleLockSlider(seriesItem);
  }, [onToggleLockSlider, seriesItem]);

  const lockIcon = useMemo(
    () => (seriesItem.isLocked ? <LockIcon /> : <LockOpenIcon />),
    [seriesItem.isLocked]
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value ? round(parseFloat(event.target.value), 1) : 0;
      onChange(value, seriesItem);
    },
    [onChange, seriesItem]
  );

  return (
    <div className={styles.horizontalSlider}>
      <div className={styles.seriesLabelWrapper}>
        <div className={styles.seriesPointer}>
          <ArrowRightIcon />
        </div>
        <div className={styles.seriesLabel}>
          {seriesItem.label}
          <IconButton onClick={handleToggleLockSlider}>{lockIcon}</IconButton>
        </div>
        <div className={styles.seriesValue}>
          <Input onChange={handleInputChange} inputMode="decimal" value={seriesItem.percentage} />%
        </div>
      </div>
      <div className={styles.sliderWrapper}>
        <Slider
          disabled={seriesItem.isLocked}
          tooltip={{ open: false }}
          min={0}
          max={100}
          value={seriesItem.percentage}
          onChange={handleChange}
          onAfterChange={handleAfterChange}
        />
      </div>
    </div>
  );
}
