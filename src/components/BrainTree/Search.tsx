import { Dispatch, SetStateAction, useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { SelectProps } from 'antd/es/select';
import { generateHierarchyPathTree } from './util';
import { BrainViewId, BrainLayerViewId } from '@/types/ontologies';
import {
  brainRegionsWithRepresentationAtom,
  selectedAlternateViews,
  selectedBrainRegionAtom,
  setSelectedBrainRegionAtom,
} from '@/state/brain-regions';
import Search from '@/components/Search';
import { NavValue } from '@/state/brain-regions/types';
import { BRAIN_VIEW_LAYER } from '@/constants/brain-hierarchy';

type SearchOption = {
  ancestors: Record<string, BrainViewId>[];
  label: string;
  leaves?: string[];
  representedInAnnotation: boolean;
  value: string;
};

/**
 * This component is a wrapper for the TreeNav component that renders a TreeNav using the brain regions data.
 * @param BrainTreeSearch.brainTreeNav container of the tree, used to select the node selected from the search dropdown from the brain regions tree
 * @param BrainTreeSearch.setValue Add new opened node to the tree  hierarchy state
 */
export default function BrainTreeSearch({
  brainTreeNav,
  setValue,
}: {
  brainTreeNav?: HTMLDivElement | null;
  setValue?: Dispatch<SetStateAction<NavValue>>;
}) {
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const brainRegions = useAtomValue(brainRegionsWithRepresentationAtom);
  const setSelectedBrainRegion = useSetAtom(setSelectedBrainRegionAtom);

  const options = brainRegions;

  const setSelectedAlternateViews = useSetAtom(selectedAlternateViews);

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
        representedInAnnotation,
        brainRegionHierarchyState
      );

      // This timeout seems to be necessary to "wait" until the nav item has been rendered before attemping to scroll to it.
      setTimeout(() => {
        const selectedNavItem = brainTreeNav?.querySelector(`[data-tree-id="${optionValue}"]`);
        selectedNavItem?.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
      }, 500);
    },
    [brainTreeNav, setSelectedBrainRegion, setSelectedAlternateViews, setValue]
  ) as SelectProps['onSelect'];

  return (
    !!options && (
      <Search<SearchOption>
        className="mb-10"
        handleSelect={handleSelect}
        options={options}
        placeholder="Search region..."
        defaultValue={selectedBrainRegion?.id}
      />
    )
  );
}
