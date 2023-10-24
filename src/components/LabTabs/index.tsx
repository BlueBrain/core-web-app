import { useAtomValue } from 'jotai';
import TopNavigation from '@/components/TopNavigation';
import { themeAtom } from '@/state/theme';
import { classNames } from '@/util/utils';

export default function BrainFactoryTabs() {
  const theme = useAtomValue(themeAtom);
  const bgClassName = theme === 'light' ? 'bg-neutral-1' : 'bg-black';

  return (
    <div className={classNames('flex w-full', bgClassName)}>
      <TopNavigation.Main />
      <TopNavigation.PrimaryDropdown
        items={[
          {
            label: 'Cell composition',
            href: '/build/cell-composition/interactive',
            baseHref: '/build/cell-composition',
          },
          {
            label: 'Cell model assignment',
            href: '/build/cell-model-assignment',
            baseHref: '/build/cell-model-assignment',
          },
          {
            label: 'Connectome definition',
            href: '/build/connectome-definition/configuration/macro',
            baseHref: '/build/connectome-definition',
          },
          {
            label: 'Connectome model assignment',
            href: '/build/connectome-model-assignment/configuration',
            baseHref: '/build/connectome-model-assignment',
          },
        ]}
      />
    </div>
  );
}
