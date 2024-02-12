'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import * as Switch from '@radix-ui/react-switch';
import { useAtom, useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import isNil from 'lodash/isNil';

import { useContextSearchParams, useLiteratureDataSource } from '../useContextualLiteratureContext';
import QAHistoryNavigation from './QANavigation';
import QABrainRegion from './QABrainRegion';
import usePathname from '@/hooks/pathname';
import { literatureSelectedBrainRegionAtom, selectedBrainRegionAtom } from '@/state/brain-regions';
import { classNames } from '@/util/utils';

function IgnoreBrainContext() {
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const [brainRegion, setLiteratureSelectedBrainRegion] = useAtom(
    literatureSelectedBrainRegionAtom
  );

  const toggleBrainRegionContext = (checked: boolean) => {
    if (checked) {
      setLiteratureSelectedBrainRegion(null);
    } else {
      setLiteratureSelectedBrainRegion(selectedBrainRegion);
    }
  };

  return (
    <div className="flex items-center px-4 pt-2">
      <Switch.Root
        id="select-all-brains"
        className={classNames(
          'group relative flex h-[16px] w-8 items-center rounded-full border border-primary-8 bg-white',
          'data-[state=checked]:border data-[state=checked]:border-primary-8 data-[state=checked]:bg-primary-8',
          'data-[disabled]:cursor-not-allowed data-[disabled]:border data-[disabled]:border-gray-500 data-[disabled]:bg-gray-300'
        )}
        title={isNil(brainRegion) ? 'Search in ' : 'Search in all brain regions'}
        onCheckedChange={toggleBrainRegionContext}
      >
        <Switch.Thumb
          className={classNames(
            'block h-[10px] w-[10px] translate-x-[2px] rounded-full transition-transform duration-100 will-change-transform',
            'data-[state=checked]:translate-x-4 data-[state=checked]:bg-white',
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
  const {
    pathname,
    isContextualMode,
    isContextualLiterature,
    removeContextualSearchParam,
    appendContextualSearchParam,
  } = useContextSearchParams();
  const returnDefaultView = () => {
    const params = isContextualLiterature
      ? removeContextualSearchParam()
      : appendContextualSearchParam();
    replace(`${pathname}?${params.toString()}`);
  };

  if (!isContextualMode) return null;
  return (
    <div className="px-4 pt-2">
      <Switch.Root
        id="select-all-brains"
        className={classNames(
          'group relative h-4 w-8 rounded-full border border-primary-8 bg-white',
          'data-[state=checked]:border data-[state=checked]:border-primary-8 data-[state=checked]:bg-primary-8',
          'data-[disabled]:cursor-not-allowed data-[disabled]:border data-[disabled]:border-gray-500 data-[disabled]:bg-gray-300'
        )}
        title="show questions relative to the context"
        onCheckedChange={returnDefaultView}
        checked={!isContextualLiterature}
      >
        <Switch.Thumb
          className={classNames(
            'block h-[10px] w-[10px] translate-x-[2px] rounded-full transition-transform duration-100 will-change-transform',
            'data-[state=checked]:translate-x-4 data-[state=checked]:bg-white',
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
  const { isContextualLiterature } = useContextSearchParams();
  const dataSource = useLiteratureDataSource();
  const isBuildSection = pathname?.startsWith('/build');
  const shouldShowNavigation = isContextualLiterature ? true : dataSource.length > 1;

  if (!shouldShowNavigation && !isBuildSection) return null;
  return (
    <div
      className={classNames(
        'my-3 box-border h-screen overflow-hidden',
        isBuildSection ? 'w-[290px]' : 'w-96 pr-4'
      )}
    >
      {true && (
        <>
          <QABrainRegion />
          <div className="mb-5 mt-2">
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
