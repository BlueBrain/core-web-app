'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import * as Switch from '@radix-ui/react-switch';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import isNil from 'lodash/isNil';

import useContextualLiteratureContext from '../useContextualLiteratureContext';
import QAHistoryNavigation from './QANavigation';
import QABrainRegion from './QABrainRegion';
import usePathname from '@/hooks/pathname';
import { literatureSelectedBrainRegionAtom } from '@/state/brain-regions';
import { useContextualLiteratureResultAtom } from '@/state/literature';
import { classNames } from '@/util/utils';

function IgnoreBrainContext() {
  const [brainRegion, setLiteratureSelectedBrainRegion] = useAtom(
    literatureSelectedBrainRegionAtom
  );
  const reset = () => setLiteratureSelectedBrainRegion(null);
  return (
    <div className="px-4 pt-2">
      <Switch.Root
        id="select-all-brains"
        className={classNames(
          'bg-white border border-primary-8 w-8 h-4 rounded-full relative group',
          'data-[state=checked]:bg-primary-8 data-[state=checked]:border data-[state=checked]:border-primary-8',
          'data-[disabled]:cursor-not-allowed data-[disabled]:bg-gray-300 data-[disabled]:border data-[disabled]:border-gray-500'
        )}
        title={
          isNil(brainRegion) ? 'A brain region should be selected' : 'Search in all brain regions'
        }
        onCheckedChange={reset}
        disabled={isNil(brainRegion)}
        checked={Boolean(brainRegion?.id) === false}
      >
        <Switch.Thumb
          className={classNames(
            'block w-[10px] h-[10px] rounded-full transition-transform duration-100 translate-x-[2px] will-change-transform',
            'data-[state=checked]:bg-white data-[state=checked]:translate-x-4',
            'data-[state=unchecked]:bg-primary-8',
            'group-[data-disabled]:bg-gray-500'
          )}
        />
      </Switch.Root>
      <label htmlFor="select-all-brains" className="ml-2 text-primary-8">
        Ignore current context
      </label>
    </div>
  );
}

function IgnoreContextualLiterature() {
  const { replace } = useRouter();
  const { reset } = useContextualLiteratureResultAtom();
  const { isContextualLiterature, pathname, clearContextSearchParams } =
    useContextualLiteratureContext();

  const returnDefaultView = () => {
    reset(null);
    const params = clearContextSearchParams();
    replace(`${pathname}?${params.toString()}`);
  };

  if (!isContextualLiterature) return null;
  return (
    <div className="px-4 pt-2">
      <Switch.Root
        id="select-all-brains"
        className={classNames(
          'bg-white border border-primary-8 w-8 h-4 rounded-full relative group',
          'data-[state=checked]:bg-primary-8 data-[state=checked]:border data-[state=checked]:border-primary-8',
          'data-[disabled]:cursor-not-allowed data-[disabled]:bg-gray-300 data-[disabled]:border data-[disabled]:border-gray-500'
        )}
        title="A brain region should be selected"
        onCheckedChange={returnDefaultView}
        checked={!isContextualLiterature}
      >
        <Switch.Thumb
          className={classNames(
            'block w-[10px] h-[10px] rounded-full transition-transform duration-100 translate-x-[2px] will-change-transform',
            'data-[state=checked]:bg-white data-[state=checked]:translate-x-4',
            'data-[state=unchecked]:bg-primary-8',
            'group-[data-disabled]:bg-gray-500'
          )}
        />
      </Switch.Root>
      <label htmlFor="select-all-brains" className="ml-2 text-primary-8">
        Show all questions
      </label>
    </div>
  );
}

function QALeftPanel() {
  const pathname = usePathname();
  const { dataSource, isContextualLiterature } = useContextualLiteratureContext();
  const isBuildSection = pathname?.startsWith('/build');
  const shouldShowNavigation = isContextualLiterature ? true : dataSource.length > 1;

  if (!shouldShowNavigation && !isBuildSection) return null;
  return (
    <div
      className={classNames(
        'box-border h-screen overflow-hidden my-3',
        isBuildSection ? 'w-[290px]' : 'w-96 pr-4'
      )}
    >
      {isBuildSection && (
        <>
          <QABrainRegion />
          <div className="mt-2 mb-5">
            <IgnoreBrainContext />
            <IgnoreContextualLiterature />
          </div>
        </>
      )}
      {shouldShowNavigation && <QAHistoryNavigation />}
    </div>
  );
}

export default QALeftPanel;
