/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react';
import { MorphologyCanvas, TgdColor } from '@bbp/morphoviewer';

import { MorphoViewerSettings, useMorphoViewerSettings } from '../../hooks/settings';
import { ColorInput } from './ColorInput';
import { classNames } from '@/util/utils';
import { EyeIcon, ResetIcon } from '@/components/icons';
import EyeSlashIcon from '@/components/icons/EyeSlashIcon';
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
  const handleToggleVisibility = (att: keyof Labels, color: string) => {
    update({ [att]: toggleOpacity(color) });
  };
  return Object.keys(labels).map((key) => {
    const att = key as keyof Labels;
    const color = settings[att];
    return (
      <ColorInput key={key} value={color} onChange={(v) => update({ [att]: v })}>
        <button
          className={styles.eye}
          type="button"
          onClick={(evt) => {
            evt.preventDefault();
            evt.stopPropagation();
            handleToggleVisibility(att, color);
          }}
        >
          {isOpaque(color) ? <EyeIcon /> : <EyeSlashIcon />}
        </button>
        <div
          className={styles.color}
          style={{
            backgroundColor: color,
            opacity: isOpaque(color) ? 1 : 0,
          }}
        />
        <div>{labels[att]}</div>
      </ColorInput>
    );
  });
}

const COLOR = new TgdColor();

/**
 * If opacity is not strictly 1.0, then the section
 * turns invisible. So we can put any value lower than
 * 1.0 to hide a section.
 *
 * We choose 0.99 because, due to alpha premultiplication,
 * the lower the alpha, the lower the resolution of the color.
 *
 * Internally, the colors are stored on unsigned bytes.
 * So if you set a pixel with color (100, 100, 100, 17),
 * then when you read it you will get (90, 90, 90, 17).
 *
 * That's why, if we want to keep the color constant when
 * we toggle it's opacity several time, its better to use
 * high alpha values.
 */
function toggleOpacity(color: string): string {
  COLOR.parse(color);
  COLOR.A = COLOR.A < 1 ? 1 : 0.99;
  return COLOR.toString();
}

function isOpaque(color: string) {
  COLOR.parse(color);
  return COLOR.A >= 1;
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
