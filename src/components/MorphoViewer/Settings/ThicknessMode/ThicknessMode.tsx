import { MorphologyCanvas } from '@bbp/morphoviewer';

import { useMorphoViewerSettings } from '../../hooks/settings';
import { Switch } from '@/components/common/Switch';
import { classNames } from '@/util/utils';

import styles from './thickness-mode.module.css';

export interface ThicknessModeProps {
  className?: string;
  painter: MorphologyCanvas;
}

export function ThicknessMode({ className, painter }: ThicknessModeProps) {
  const [settings, update] = useMorphoViewerSettings(painter);
  const handleChange = (checked: boolean) => {
    update({ radiusType: checked ? 1 : 0 });
  };
  return (
    <Switch
      className={classNames(className, styles.main)}
      background="var(--custom-color-back)"
      color="var(--custom-color-accent)"
      labelForFalse="accurate"
      labelForTrue="uniform"
      value={settings.radiusType > 0.5}
      onChange={handleChange}
    >
      Dendrite thickness
    </Switch>
  );
}
