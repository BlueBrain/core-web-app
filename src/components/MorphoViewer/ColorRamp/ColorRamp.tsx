import React from 'react';
import { MorphologyPainter } from '@bbp/morphoviewer';

import { useMorphoViewerSettings } from '../hooks/settings';
import { classNames } from '@/util/utils';

import styles from './color-ramp.module.css';

export interface ColorRampProps {
  className?: string;
  painter: MorphologyPainter;
}

export function ColorRamp({ className, painter }: ColorRampProps) {
  const [settings] = useMorphoViewerSettings(painter);
  if (settings.colorBy === 'section') return null;

  return (
    <div className={classNames(styles.main, className)}>
      <div className={styles.caption}>
        Proximity
        <br />
        with
        <br />
        soma
      </div>
      <div className={styles.colorramp} />
      <div className={styles.value}>0 µm</div>
      <div />
      <div className={styles.value}>{painter.maxDendriteLength.toFixed(0)} µm</div>
    </div>
  );
}
