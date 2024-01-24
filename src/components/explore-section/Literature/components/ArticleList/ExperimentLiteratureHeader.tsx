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
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/experiment-types';
import { ArticleListFilters as Filters } from '@/components/explore-section/Literature/api';
import If from '@/components/ConditionalRenderer/If';
import { selectedBrainRegionAtom } from '@/state/brain-regions';
import { brainRegionTitleCaseExceptConjunctions } from '@/util/utils';

function ExperimentLiteratureHeader({ loading }: { loading?: boolean }) {
  const router = useRouter();
  const [brainRegion] = useQueryState('brainRegion');
  const params = useParams<{ 'experiment-data-type': string }>();
  const openFilterPanel = useSetAtom(articleListingFilterPanelOpenAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const filters = useAtomValue(articleListFiltersAtom);
  const brainRegionTitle = selectedBrainRegion?.title;

  const menuItems = Object.values(EXPERIMENT_DATA_TYPES).map((config) => ({
    key: config.name,
    title: config.title,
    label: <span className="font-normal text-base">{config.title}</span>,
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
      <div className="flex items-center justify-between m-auto px-8 pb-6 max-w-7xl w-full sticky top-0 z-[2] bg-white">
        <div className="flex w-full gap-1 items-center">
          <span className="text-base text-neutral-3 mr-4 min-w-fit">Search criteria: </span>
          <div className="flex items-center justify-center gap-1">
            <div className="h-max py-2 px-3 hover:bg-neutral-1 rounded-md text-primary-8 cursor-default">
              {brainRegionTitleCaseExceptConjunctions(brainRegionTitle ?? '')}
            </div>
            <div className="h-max py-2 px-1 select-none">
              <CaretRightFilled className="text-neutral-2" />
            </div>
            <Dropdown trigger={['click']} menu={{ items: menuItems, onClick: onSelectType }}>
              <button
                type="button"
                data-testid="experiment-types-button"
                className="flex items-center gap-2 h-max py-2 px-3 hover:bg-neutral-1 rounded-md text-primary-8"
              >
                {find(menuItems, { key: params['experiment-data-type'] })?.title}
                <DownOutlined className="text-primary-8 w-3 h-3" />
              </button>
            </Dropdown>
          </div>
        </div>
        <button
          type="button"
          className="bg-white flex gap-10 items-center justify-between p-3 rounded-md min-w-fit border border-neutral-2 ml-auto disabled:bg-gray-100"
          onClick={() => openFilterPanel(true)}
          disabled={loading}
        >
          <div>
            <span className="text-white text-sm bg-primary-8 font-semibold rounded-md px-3 py-1">
              <span data-testid="active-filters-count">{total}</span>
            </span>
            <span className="text-primary-8 text-base font-bold mr-2">
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
