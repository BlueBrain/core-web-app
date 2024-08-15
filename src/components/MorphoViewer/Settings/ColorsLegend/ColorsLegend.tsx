/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react';
import { MorphologyCanvas } from '@bbp/morphoviewer';

import { MorphoViewerSettings, useMorphoViewerSettings } from '../../hooks/settings';
import { ColorInput } from './ColorInput';
import { classNames } from '@/util/utils';
import { ResetIcon } from '@/components/icons';
import { Switch } from '@/components/common/Switch';

import styles from './colors-legend.module.css';

export interface ColorsLegendProps {
  className?: string;
  painter: MorphologyCanvas;
}

interface Labels {
  colorSoma: string;
  colorBasalDendrite: string;
  colorApicalDendrite: string;
  colorAxon: string;
}

/**
 * This is a mapping between the MorphoViewerSettings'
 * color attributes and the label to display for them.
 */
const LABELS_EXPANDED: Labels = {
  colorSoma: 'Soma',
  colorBasalDendrite: 'Basal dendrite',
  colorApicalDendrite: 'Apical dendrite',
  colorAxon: 'Axon',
};

/**
 * If we don't have both basal and apical dendrites,
 * we should just write "Dendrite".
 */
const LABELS_COLLAPSED: Labels = {
  colorSoma: 'Soma',
  colorBasalDendrite: 'Dendrite',
  colorApicalDendrite: 'Dendrite',
  colorAxon: 'Axon',
};

export function ColorsLegend({ className, painter }: ColorsLegendProps) {
  const [, setBackground] = useState(painter.colors.background);
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
    <div className={classNames(styles.main, className)}>
      <Switch
        background="var(--custom-color-back)"
        color="var(--custom-color-accent)"
        value={settings.isDarkMode}
        onChange={(isDarkMode: boolean) => update({ isDarkMode })}
      >
        Dark mode
      </Switch>
      {renderLabels(getProperLabels(painter), settings, update)}
      <button className={styles.reset} type="button" onClick={handleReset}>
        <ResetIcon className={styles.icon} />
        <div>Reset colors</div>
      </button>
    </div>
  );
}

function renderLabels(
  labels: Partial<Labels>,
  settings: MorphoViewerSettings,
  update: (patch: Partial<MorphoViewerSettings>) => void
) {
  return Object.keys(labels).map((key) => {
    const att = key as keyof Labels;
    const color = settings[att];
    return (
      <ColorInput
        key={key}
        value={color}
        onChange={(v) => update({ [att]: v })}
        label={labels[att] ?? ''}
        canBeHidden={att !== 'colorSoma'}
      />
    );
  });
}

function getProperLabels(painter: MorphologyCanvas): Partial<Labels> {
  const labels = getCorrectLabelsVersionDependingOnDendrites(painter);
  const output: Partial<Labels> = {};
  if (painter.hasSoma()) output.colorSoma = labels.colorSoma;
  if (painter.hasBasalDendrite()) output.colorBasalDendrite = labels.colorBasalDendrite;
  if (painter.hasApicalDendrite()) output.colorApicalDendrite = labels.colorApicalDendrite;
  if (painter.hasAxon()) output.colorAxon = labels.colorAxon;

  return output;
}

function getCorrectLabelsVersionDependingOnDendrites(painter: MorphologyCanvas): Labels {
  if (!painter.hasBasalDendrite()) return LABELS_COLLAPSED;
  if (!painter.hasApicalDendrite()) return LABELS_COLLAPSED;
  return LABELS_EXPANDED;
}
