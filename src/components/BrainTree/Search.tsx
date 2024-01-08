import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { SelectProps } from 'antd/es/select';
import { getAncestors, generateHierarchyPathTree } from './util';
import { BrainViewId, BrainLayerViewId } from '@/types/ontologies';
import {
  // brainRegionsAtom,
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

  // This function returns either the hasPart or hasLayerPart array of brain region IDs, depending on the currently selected "view" (think: default or layer-based).
  function getDescendentsFromView(
    hasPart?: string[],
    hasLayerPart?: string[],
    view?: string
  ): string[] | undefined {
    let descendents;

    // Currently, it seems that "layer" brain regions have the default view ID, even if they will never appear in the default hierarchy.
    switch (view) {
      case BRAIN_VIEW_LAYER:
        descendents = hasLayerPart;
        break;
      default: // This means that by default, layer-based views also have the default view ID (see brainRegionOntologyAtom).
        descendents = hasPart ?? hasLayerPart; // To compensate for this, we first check whether hasPart, before falling-back on hasLayerPart (for the layer-based brain-regions).
    }

    return descendents;
  }

  // This function's purpose is similar to that of itemsInAnnotationReducer(), in that it looks for the descendents of a brain region to recursively check whether at least one of the descendents is represented in the annotation volume.
  // The difference is that this function relies on a flat brainRegions array, whereas itemsInAnnotationReducer() is used to handle the nested tree hierarchy structure.
  const checkRepresentationOfDescendents = useCallback(
    (representedInAnnotation: boolean, brainRegionId: string): boolean => {
      if (representedInAnnotation) {
        return representedInAnnotation; // It only needs to be true for one.
      }

      const brainRegion = brainRegions?.find(({ id }) => id === brainRegionId);

      const descendents = getDescendentsFromView(
        brainRegion?.hasPart,
        brainRegion?.hasLayerPart,
        brainRegion?.view
      );

      const descendentsRepresentedInAnnotation =
        descendents?.reduce(checkRepresentationOfDescendents, false) ?? false; // If no descendents, then no descendents are represented.

      return brainRegion?.representedInAnnotation ?? descendentsRepresentedInAnnotation;
    },
    [brainRegions]
  );

  const options = useMemo(
    () =>
      brainRegions?.map(({ title, id, isPartOf, isLayerPartOf, ...rest }) => {
        const ancestors = getAncestors(brainRegions, id);

        return {
          ancestors,
          label: title,
          isLayerPartOf,
          isPartOf,
          value: id,
          ...rest,
        };
      }) ?? [],
    [brainRegions]
  );

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
    <Search<SearchOption>
      className="mb-10"
      handleSelect={handleSelect}
      options={options}
      placeholder="Search region..."
      defaultValue={selectedBrainRegion?.id}
    />
  );
}
