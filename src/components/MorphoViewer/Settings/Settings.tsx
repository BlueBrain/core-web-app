import { useState } from 'react';
import { MorphologyCanvas } from '@bbp/morphoviewer';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';

import { ColorsLegend } from './ColorsLegend';
import { DendriteThickness } from './DendriteThickness';
import { ThicknessMode } from './ThicknessMode';
import { ColorMode } from './ColorMode';
import { classNames } from '@/util/utils';
import { SettingsIcon } from '@/components/icons';

import styles from './settings.module.css';

export interface SettingsProps {
  className?: string;
  painter: MorphologyCanvas;
}

export function Settings({ className, painter }: SettingsProps) {
  const [expand, setExpand] = useState(false);
  return (
    <div className={classNames(styles.main, className, expand ? styles.expand : styles.collapse)}>
      <button type="button" onClick={() => setExpand(true)}>
        <SettingsIcon />
        <div>Settings</div>
      </button>
      <div>
        <div>
          <button type="button" onClick={() => setExpand(false)} aria-label="Close settings">
            <CloseIcon />
          </button>
        </div>
        <ColorsLegend className={styles.legend} painter={painter} />
        <DendriteThickness painter={painter} />
        <ThicknessMode painter={painter} />
        <ColorMode painter={painter} />
      </div>
    </div>
  );
}
