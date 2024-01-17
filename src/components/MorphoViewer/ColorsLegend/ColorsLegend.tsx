/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react';
import { MorphologyPainter, colorContrast } from '@bbp/morphoviewer';

import { ColorInput } from './ColorInput';
import { classNames } from '@/util/utils';
import { logError } from '@/util/logger';
import { assertType } from '@/util/type-guards';

import styles from './colors-legend.module.css';

export interface ColorsLegendProps {
  className?: string;
  painter: MorphologyPainter;
}

const OPTIONS: Record<keyof Colors, string> = {
  soma: 'Soma',
  basalDendrite: 'Basal dendrite',
  apicalDendrite: 'Apical dendrite',
  axon: 'Axon',
  background: 'Background',
};

export function ColorsLegend({ className, painter }: ColorsLegendProps) {
  const [colors, update] = useColors(painter);
  return (
    <div
      className={classNames(styles.main, className)}
      style={{
        backgroundColor: `color-mix(in srgb, ${colors.background}, transparent 20%)`,
        color: colorContrast(colors.background, '#000d', '#fffd'),
      }}
    >
      {Object.keys(OPTIONS).map((key) => {
        const att = key as keyof Colors;
        return (
          <ColorInput key={key} value={colors[att]} onChange={(v) => update({ [att]: v })}>
            <div
              className={styles.color}
              style={{
                backgroundColor: colors[att],
              }}
            />
            <div>{OPTIONS[att]}</div>
          </ColorInput>
        );
      })}
    </div>
  );
}

interface Colors {
  background: string;
  soma: string;
  axon: string;
  apicalDendrite: string;
  basalDendrite: string;
}

function useColors(
  painter: MorphologyPainter
): [colors: Colors, update: (values: Partial<Colors>) => void] {
  const [colors, setColors] = useState<Colors>(loadColors(painter));
  useEffect(() => {
    painter.eventColorsChange.addListener(setColors);
    return () => painter.eventColorsChange.removeListener(setColors);
  }, [painter]);
  return [
    colors,
    (values: Partial<Colors>) => {
      const newColors = { ...colors, ...values };
      setColors(newColors);
      saveColors(newColors);
      painter.colors.apicalDendrite = newColors.apicalDendrite;
      painter.colors.axon = newColors.axon;
      painter.colors.background = newColors.background;
      painter.colors.basalDendrite = newColors.basalDendrite;
      painter.colors.soma = newColors.soma;
    },
  ];
}

const STORAGE_KEY = 'MorphoViewer/Colors';

function loadColors(painter: MorphologyPainter): Colors {
  try {
    const content = window.localStorage.getItem(STORAGE_KEY);
    if (!content) return painter.colors;

    const data = JSON.parse(content);
    assertType<Colors>(data, {
      apicalDendrite: 'string',
      axon: 'string',
      background: 'string',
      basalDendrite: 'string',
      soma: 'string',
    });
    painter.colors.apicalDendrite = data.apicalDendrite;
    painter.colors.axon = data.axon;
    painter.colors.background = data.background;
    painter.colors.basalDendrite = data.basalDendrite;
    painter.colors.soma = data.soma;
    return data;
  } catch (ex) {
    logError('Unable to load MorphoViewer/Colors!', ex);
    return painter.colors;
  }
}

function saveColors(colors: Colors) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
}
