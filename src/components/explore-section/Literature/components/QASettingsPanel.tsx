/* eslint-disable jsx-a11y/label-has-associated-control */
import { usePathname } from 'next/navigation';
import { useAtom, useAtomValue } from 'jotai';
import isNil from 'lodash/isNil';
import * as Switch from '@radix-ui/react-switch';

import { literatureResultAtom, useLiteratureAtom } from '@/state/literature';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import styles from './settings.module.scss';

export default function QASettingsPanel() {
  const pathname = usePathname();
  const isBuildSection = pathname?.startsWith('/build');
  const update = useLiteratureAtom();
  const [selectedBrainRegion, updateSelectedBrainRegion] = useAtom(selectedBrainRegionAtom);
  const QAs = useAtomValue(literatureResultAtom);

  if (!isBuildSection || QAs.length === 0) {
    return null;
  }

  return (
    <div className={styles.settingsContainer}>
      <span className={`${styles.settingsBaseText} text-gray-300`}>Settings Panel</span>
      <div>
        <div className="my-2">
          <Switch.Root
            className={styles.switchRoot}
            title={
              isNil(selectedBrainRegion)
                ? 'A brain region should be selected'
                : 'Search in all brain regions'
            }
            onCheckedChange={() => updateSelectedBrainRegion(null)}
            disabled={isNil(selectedBrainRegion)}
            checked={Boolean(selectedBrainRegion?.id) === false}
            id="select-all-brains"
          >
            <Switch.Thumb className={styles.switchThumb} />
          </Switch.Root>
          <label className={styles.settingsLabel} htmlFor="select-all-brains">
            Search in all brain regions
          </label>
        </div>
        <div className="my-2">
          <Switch.Root
            className={styles.switchRoot}
            title={
              isNil(selectedBrainRegion)
                ? 'A brain region should be selected'
                : 'Show only current brain region questions'
            }
            onCheckedChange={(checked) => update('showOnlyBrainRegionQuestions', checked)}
            disabled={isNil(selectedBrainRegion)}
            id="show-only-brain-region-qas"
          >
            <Switch.Thumb className={styles.switchThumb} />
          </Switch.Root>
          <label htmlFor="show-only-brain-region-qas" className={styles.settingsLabel}>
            Show only current brain region questions
          </label>
        </div>
      </div>
    </div>
  );
}
