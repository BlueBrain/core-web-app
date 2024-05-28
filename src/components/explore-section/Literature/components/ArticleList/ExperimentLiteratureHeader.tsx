'use client';

import { memo } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useParams, useRouter } from 'next/navigation';
import { Dropdown, MenuProps } from 'antd';
import { CaretRightFilled, DownOutlined } from '@ant-design/icons';
import { useQueryState } from 'nuqs';
import find from 'lodash/find';

import { SettingsIcon } from '@/components/icons';
import {
  initialFilters,
  articleListFiltersAtom,
  articleListingFilterPanelOpenAtom,
} from '@/state/explore-section/literature-filters';
import { ArticleListFilters as Filters } from '@/components/explore-section/Literature/api';
import If from '@/components/ConditionalRenderer/If';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { brainRegionTitleCaseExceptConjunctions } from '@/util/utils';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/data-types/experiment-data-types';
import { ExperimentDataTypeName } from '@/types/explore-section/data-types';

function ExperimentLiteratureHeader({ loading }: { loading?: boolean }) {
  const router = useRouter();
  const [brainRegion] = useQueryState('brainRegion');
  const params = useParams<{ 'experiment-data-type': ExperimentDataTypeName }>();
  const openFilterPanel = useSetAtom(articleListingFilterPanelOpenAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const filters = useAtomValue(articleListFiltersAtom);
  const brainRegionTitle = selectedBrainRegion?.title;

  const menuItems = Object.values(EXPERIMENT_DATA_TYPES).map((config) => ({
    key: config.name,
    title: config.title,
    label: <span className="text-base font-normal">{config.title}</span>,
  }));

  const total = getActiveFiltersCount(filters, initialFilters);
  const onSelectType: MenuProps['onClick'] = ({ key }) => {
    if (brainRegion) {
      router.push(
        `/explore/interactive/literature/${key}?brainRegion=${encodeURIComponent(brainRegion)}`
      );
    }
  };

  return (
    <If id="breadcrumb" condition={Boolean(brainRegionTitle)}>
      <div className="sticky top-0 z-[2] m-auto flex w-full max-w-7xl items-center justify-between bg-white px-8 pb-6">
        <div className="flex w-full items-center gap-1">
          <span className="mr-4 min-w-fit text-base text-neutral-3">Search criteria: </span>
          <div className="flex items-center justify-center gap-1">
            <div className="h-max cursor-default rounded-md px-3 py-2 text-primary-8 hover:bg-neutral-1">
              {brainRegionTitleCaseExceptConjunctions(brainRegionTitle ?? '')}
            </div>
            <div className="h-max select-none px-1 py-2">
              <CaretRightFilled className="text-neutral-2" />
            </div>
            <Dropdown trigger={['click']} menu={{ items: menuItems, onClick: onSelectType }}>
              <button
                type="button"
                data-testid="experiment-types-button"
                className="flex h-max items-center gap-2 rounded-md px-3 py-2 text-primary-8 hover:bg-neutral-1"
              >
                {find(menuItems, { key: params['experiment-data-type'] })?.title}
                <DownOutlined className="h-3 w-3 text-primary-8" />
              </button>
            </Dropdown>
          </div>
        </div>
        <button
          type="button"
          className="ml-auto flex min-w-fit items-center justify-between gap-10 rounded-md border border-neutral-2 bg-white p-3 disabled:bg-gray-100"
          onClick={() => openFilterPanel(true)}
          disabled={loading}
        >
          <div>
            <span className="rounded-md bg-primary-8 px-3 py-1 text-sm font-semibold text-white">
              <span data-testid="active-filters-count">{total}</span>
            </span>
            <span className="mr-2 text-base font-bold text-primary-8">
              {' '}
              filter{total > 1 ? 's' : ''}
            </span>
          </div>
          <SettingsIcon className="rotate-90 text-primary-8" />
        </button>
      </div>
    </If>
  );
}

export default memo(ExperimentLiteratureHeader);

const getActiveFiltersCount = (currentFilters: Filters, defaultFilters: Filters) => {
  let activeFilters = 0;

  if (
    currentFilters.publicationDate?.lte !== defaultFilters.publicationDate?.lte ||
    currentFilters.publicationDate?.gte !== defaultFilters.publicationDate?.gte
  ) {
    activeFilters += 1;
  }

  if (currentFilters.authors.length !== defaultFilters.authors.length) {
    activeFilters += 1;
  }

  if (currentFilters.journals.length !== defaultFilters.journals.length) {
    activeFilters += 1;
  }

  if (currentFilters.articleTypes.length !== defaultFilters.articleTypes.length) {
    activeFilters += 1;
  }

  return activeFilters;
};
