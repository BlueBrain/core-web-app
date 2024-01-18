import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { SelectProps } from 'antd/es/select';

import { generateHierarchyPathTree } from './util';
import { BrainLayerViewId, BrainRegion } from '@/types/ontologies';
import {
  brainRegionsWithRepresentationAtom,
  selectedAlternateViews,
  setSelectedBrainRegionAtom,
} from '@/state/brain-regions';
import Search from '@/components/Search';
import { NavValue } from '@/state/brain-regions/types';
import { BRAIN_VIEW_LAYER } from '@/constants/brain-hierarchy';
import filterAndSortBasedOnPosition from '@/util/filterAndSortBasedOnPosition';

export type SearchOption = BrainRegion & { label: string; value: string };

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
  const brainRegionsOptions = useAtomValue(brainRegionsWithRepresentationAtom) as unknown as
    | SearchOption[]
    | null; // TODO: Fix this. Where does "value" come from (if it's not part of BrainRegion)?
  const [searchOptions, setSearchOptions] = useState<SearchOption[] | null>(
    brainRegionsOptions ?? []
  );

  const handleSelect = useCallback(
    (_labeledValue: string, option: SearchOption) => {
      const { ancestors, value, label, leaves, representedInAnnotation } = option;

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
        value,
        label,
        leaves ?? null,
        representedInAnnotation,
        brainRegionHierarchyState
      );

      // This timeout seems to be necessary to "wait" until the nav item has been rendered before attemping to scroll to it.
      setTimeout(() => {
        const selectedNavItem = brainTreeNav?.querySelector(`[data-tree-id="${value}"]`);

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
          brainRegionsOptions?.length
            ? filterAndSortBasedOnPosition<SearchOption>(
                value.trim().toLowerCase(),
                brainRegionsOptions
              )
            : null
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
    !!searchOptions && (
      <Search<SearchOption>
        useSearchInsteadOfFilter
        className="mb-10"
        options={searchOptions}
        placeholder="Search region..."
        onClear={onClearSearch}
        handleSelect={handleSelect}
        handleSearch={handleSearch}
      />
    )
  );
}
