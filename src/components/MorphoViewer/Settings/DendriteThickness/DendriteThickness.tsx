import React, { useEffect, useState } from 'react';
import { MorphologyCanvas } from '@bbp/morphoviewer';

import { classNames } from '@/util/utils';
import { Slider } from '@/components/common/Slider';

import styles from './dendrite-thickness.module.css';

export interface DendriteThicknessProps {
  className?: string;
  painter: MorphologyCanvas;
}

export function DendriteThickness({ className, painter }: DendriteThicknessProps) {
  const [radiusMultiplier, setRadiusMultiplier] = useRadiusMultiplier(painter, 1);
  return (
    <div className={classNames(styles.main, className)}>
      <div>Thickness:</div>
      <div>
        <b>{(100 * radiusMultiplier).toFixed(0)}</b> %
      </div>
      <Slider
        className={styles.slider}
        min={0.5}
        max={5}
        step={0.1}
        value={radiusMultiplier}
        onChange={setRadiusMultiplier}
      />
    </div>
  );
}

function useRadiusMultiplier(
  painter: MorphologyCanvas,
  value: number
): [number, (value: number) => void] {
  const [radiusMultiplier, setRadiusMultiplier] = useState(value);
  useEffect(() => {
    // eslint-disable-next-line no-param-reassign
    painter.radiusMultiplier = radiusMultiplier;
  }, [painter, radiusMultiplier]);
  return [radiusMultiplier, setRadiusMultiplier];
}
