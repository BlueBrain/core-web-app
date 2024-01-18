import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useSetAtom } from 'jotai';
import { SelectProps } from 'antd/es/select';

import { generateHierarchyPathTree } from './util';
import useBrainRegionOptions, { SearchOption } from './useBrainRegionOptions';
import { BrainLayerViewId } from '@/types/ontologies';
import { selectedAlternateViews, setSelectedBrainRegionAtom } from '@/state/brain-regions';
import Search from '@/components/Search';
import { NavValue } from '@/state/brain-regions/types';
import { BRAIN_VIEW_LAYER } from '@/constants/brain-hierarchy';
import filterAndSortBasedOnPosition from '@/util/filterAndSortBasedOnPosition';

/**
 * This component is a wrapper for the TreeNav component that renders a TreeNav using the brain regions data.
 * @param BrainTreeSearch.brainTreeNav container of the tree, used to select the node selected from the search dropdown from the brain regions tree
 * @param BrainTreeSearch.setValue Add new opened node to the tree  hierarchy state
 */
export default function BrainTreeSearch({
  brainTreeNav,
  setValue,
  onClear = () => {},
}: {
  brainTreeNav?: HTMLDivElement | null;
  setValue?: Dispatch<SetStateAction<NavValue>>;
  onClear?: () => void;
}) {
  const setSelectedBrainRegion = useSetAtom(setSelectedBrainRegionAtom);
  const setSelectedAlternateViews = useSetAtom(selectedAlternateViews);
  const brainRegionsOptions = useBrainRegionOptions();
  const [searchOptions, setSearchOptions] = useState<Array<SearchOption>>(brainRegionsOptions);

  const handleSelect = useCallback(
    (_labeledValue: string, option: SearchOption) => {
      const { ancestors, value: optionValue, label, leaves, representedInAnnotation } = option;

      if (!ancestors) return;

      const brainRegionHierarchyState = generateHierarchyPathTree(
        ancestors.map((ancestor) => Object.keys(ancestor)[0])
      );

      setValue?.(brainRegionHierarchyState);

      // If the selected option is a layer-based region, replace the selectedAlternateViews with it and its layer-based ancestors.
      const newlySelectedAlternateViews = ancestors.reduce<Record<string, BrainLayerViewId>>(
        (acc, cur) => {
          const [brainRegionId, viewId] = Object.entries(cur)[0];

          return viewId === BRAIN_VIEW_LAYER ? { ...acc, ...{ [brainRegionId]: viewId } } : acc;
        },
        {}
      );

      setSelectedAlternateViews(newlySelectedAlternateViews);

      setSelectedBrainRegion(
        optionValue as string,
        label as string,
        leaves ?? null,
        representedInAnnotation
      );
      // This timeout seems to be necessary to "wait" until the nav item has been rendered before attemping to scroll to it.
      setTimeout(() => {
        const selectedNavItem = brainTreeNav?.querySelector(`[data-tree-id="${optionValue}"]`);
        selectedNavItem?.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
      }, 500);
    },
    [brainTreeNav, setSelectedBrainRegion, setSelectedAlternateViews, setValue]
  ) as SelectProps['onSelect'];

  const handleSearch = useCallback(
    (value: string) => {
      if (!value.trim()) {
        setSearchOptions(brainRegionsOptions);
      } else {
        setSearchOptions(
          filterAndSortBasedOnPosition(value.trim().toLowerCase(), brainRegionsOptions)
        );
      }
    },
    [brainRegionsOptions]
  );

  const onClearSearch = () => {
    onClear?.();
    setSearchOptions(brainRegionsOptions);
  };

  return (
    <Search<SearchOption>
      useSearchInsteadOfFilter
      className="mb-10"
      options={searchOptions}
      placeholder="Search region..."
      onClear={onClearSearch}
      handleSelect={handleSelect}
      handleSearch={handleSearch}
    />
  );
}
