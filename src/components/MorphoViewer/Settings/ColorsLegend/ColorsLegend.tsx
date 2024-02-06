/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react';
import { MorphologyPainter } from '@bbp/morphoviewer';

import { useMorphoViewerSettings } from '../../hooks/settings';
import { ColorInput } from './ColorInput';
import { classNames } from '@/util/utils';
import { ResetIcon } from '@/components/icons';
import { Switch } from '@/components/common/Switch';

import styles from './colors-legend.module.css';

export interface ColorsLegendProps {
  className?: string;
  painter: MorphologyPainter;
}

/**
 * This is a mapping between the MorphoViewerSettings'
 * color attributes and the label to display for them.
 */
const LABELS = {
  colorSoma: 'Soma',
  colorBasalDendrite: 'Basal dendrite',
  colorApicalDendrite: 'Apical dendrite',
  colorAxon: 'Axon',
};

export function ColorsLegend({ className, painter }: ColorsLegendProps) {
  const [background, setBackground] = useState(painter.colors.background);
  const [settings, update, resetColors] = useMorphoViewerSettings(painter);
  const handleReset = () => {
    resetColors(settings.isDarkMode);
  };

  useEffect(() => {
    const handleColorChange = () => {
      setBackground(painter.colors.background);
    };
    handleColorChange();
    painter.eventColorsChange.addListener(handleColorChange);
    return () => painter.eventColorsChange.removeListener(handleColorChange);
  }, [painter]);

  return (
    <div
      className={classNames(styles.main, className)}
      style={{
        backgroundColor: `color-mix(in srgb, ${background}, transparent 20%)`,
      }}
    >
      <Switch
        background="var(--custom-color-back)"
        color="var(--custom-color-accent)"
        value={settings.isDarkMode}
        onChange={(isDarkMode: boolean) => update({ isDarkMode })}
      >
        Dark mode
      </Switch>
      {Object.keys(LABELS).map((key) => {
        const att = key as keyof typeof LABELS;
        const color = settings[att];
        return (
          <ColorInput key={key} value={color} onChange={(v) => update({ [att]: v })}>
            <div
              className={styles.color}
              style={{
                backgroundColor: color,
              }}
            />
            <div>{LABELS[att]}</div>
          </ColorInput>
        );
      })}
      <button className={styles.reset} type="button" onClick={handleReset}>
        <ResetIcon className={styles.icon} />
        <div>Reset colors</div>
      </button>
    </div>
  );
}
