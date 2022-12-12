import React, { ChangeEvent, useCallback, useMemo } from 'react';
import { Input, Slider } from 'antd';
import { DistributionSliderSeries } from '@/services/distribution-sliders/types';
import EyeIcon from '@/components/icons/EyeIcon';
import round from '@/services/distribution-sliders/round';
import LockIcon from '@/components/icons/LockIcon';
import IconButton from '@/components/IconButton';
import LockOpenIcon from '@/components/icons/LockOpenIcon';

import styles from './vertical-slider.module.scss';

interface VerticalSliderProps {
  seriesItem: DistributionSliderSeries;
  isSelected: boolean;
  onChange: (value: number, seriesItem: DistributionSliderSeries) => void;
  onAfterChange: (value: number, seriesItem: DistributionSliderSeries) => void;
  onToggleLockSlider: (seriesItem: DistributionSliderSeries) => void;
}

function VerticalSlider({
  seriesItem,
  onChange,
  onAfterChange,
  isSelected,
  onToggleLockSlider,
}: VerticalSliderProps) {
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
    <div className={`${styles.verticalSlider} ${isSelected ? styles.verticalSliderSelected : ``}`}>
      <div className={styles.seriesHeader}>
        <div className={styles.seriesLabel}>{seriesItem.label}</div>
        <div>
          <IconButton onClick={handleToggleLockSlider}>{lockIcon}</IconButton>
        </div>
        <div>
          <IconButton>
            <EyeIcon />
          </IconButton>
        </div>
      </div>

      <div className={styles.seriesColorBar} style={{ backgroundColor: seriesItem.color }} />

      <div className={styles.seriesValue}>
        <Input onChange={handleInputChange} inputMode="decimal" value={seriesItem.percentage} />%
      </div>

      <div className={styles.sliderWrapper}>
        <Slider
          vertical
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

export default VerticalSlider;
