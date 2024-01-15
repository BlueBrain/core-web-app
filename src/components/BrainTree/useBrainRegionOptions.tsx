import { useCallback, useMemo } from 'react';
import { useAtomValue } from 'jotai';

import { getAncestors } from './util';
import { brainRegionsAtom } from '@/state/brain-regions';
import { BrainViewId } from '@/types/ontologies';
import { BRAIN_VIEW_LAYER } from '@/constants/brain-hierarchy';

export type SearchOption = {
  ancestors: Record<string, BrainViewId>[];
  label: string;
  leaves?: string[];
  representedInAnnotation: boolean;
  value: string;
};

export default function useBrainRegionOptions() {
  const brainRegions = useAtomValue(brainRegionsAtom);

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

  const brainRegionsOptions = useMemo(
    () =>
      brainRegions?.reduce<SearchOption[]>(
        (acc, { title, id, hasPart, hasLayerPart, leaves, representedInAnnotation, view }) => {
          const descendents = getDescendentsFromView(hasPart, hasLayerPart, view);

          const descendentsRepresentedInAnnotation = descendents?.reduce(
            checkRepresentationOfDescendents,
            false
          );

          return representedInAnnotation || descendentsRepresentedInAnnotation
            ? [
                ...acc,
                {
                  ancestors: getAncestors(brainRegions, id),
                  label: title,
                  leaves,
                  representedInAnnotation,
                  value: id,
                },
              ]
            : acc;
        },
        []
      ) ?? [],
    [brainRegions, checkRepresentationOfDescendents]
  );

  return brainRegionsOptions;
}
