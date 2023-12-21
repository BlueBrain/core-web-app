import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useMemo } from 'react';
import lodashMap from 'lodash/map';
import omit from 'lodash/omit';
import intersection from 'lodash/intersection';
import { unwrap } from 'jotai/utils';

import {
  brainRegionsAtom,
  dataBrainRegionsAtom,
  meshDistributionsAtom,
  selectedBrainRegionAtom,
  selectedBrainRegionsWithChildrenAtom,
  visibleBrainRegionsAtom,
} from '@/state/brain-regions';
import { sectionAtom } from '@/state/application';
import { getBrainRegionDescendants } from '@/state/brain-regions/descendants';
import { useAtlasVisualizationManager } from '@/state/atlas';
import { generateHierarchyPathTree, getAncestors } from '@/components/BrainTree/util';
import { setInitializationValue } from '@/util/utils';
import {
  DEFAULT_BRAIN_REGION_STORAGE_KEY,
  DEFAULT_BRAIN_REGION,
} from '@/constants/brain-hierarchy';
import { DefaultBrainRegionType } from '@/state/brain-regions/types';

export function useDisplayMesh() {
  const sectionName = useAtomValue(sectionAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const section = useAtomValue(sectionAtom);
  const id = selectedBrainRegion?.id;
  const [visibleBrainRegions, setVisibleBrainRegions] = useAtom(visibleBrainRegionsAtom(section));
  const brainRegions = useAtomValue(
    useMemo(() => unwrap(getBrainRegionDescendants(id ? [id] : [])), [id])
  );
  const meshDistributions = useAtomValue(unwrap(meshDistributionsAtom));
  const atlas = useAtlasVisualizationManager();

  useEffect(() => {
    if (!selectedBrainRegion || !visibleBrainRegions || !id || !brainRegions || !sectionName)
      return;
    if (visibleBrainRegions.includes(id)) return;

    const cell = !!id && atlas.findVisibleCell(id);
    const meshDistribution = meshDistributions && id && meshDistributions[id];
    const mesh = meshDistribution && atlas.findVisibleMesh(meshDistribution.contentUrl);
    const colorCode = brainRegions?.find(
      (brainRegion) => brainRegion.id === selectedBrainRegion?.id
    )?.colorCode;

    if (meshDistribution && colorCode) {
      if (cell) {
        atlas.removeVisibleCells(cell.regionID);
      } else {
        atlas.addVisibleObjects({
          type: 'cell',
          regionID: id,
          color: colorCode,
          isLoading: false,
          hasError: false,
        });
      }
      if (mesh) {
        atlas.removeVisibleMeshesOrPointClouds(mesh.contentURL, id);
      } else {
        atlas.addVisibleObjects(
          {
            type: 'mesh',
            contentURL: meshDistribution.contentUrl,
            color: colorCode,
            isLoading: false,
            hasError: false,
          },
          {
            type: 'pointCloud',
            regionID: id,
            color: colorCode,
            isLoading: false,
            hasError: false,
          }
        );
      }
    }

    setVisibleBrainRegions([id]);
  }, [
    selectedBrainRegion,
    atlas,
    brainRegions,
    id,
    meshDistributions,
    setVisibleBrainRegions,
    visibleBrainRegions,
    sectionName,
  ]);
}

export function useCollectExperimentalData() {
  const sectionName = useAtomValue(sectionAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const [dataBrainRegions, setDataBrainRegions] = useAtom(dataBrainRegionsAtom);
  const id = selectedBrainRegion?.id;
  const brainRegions = useAtomValue(
    useMemo(() => unwrap(getBrainRegionDescendants(id ? [id] : [])), [id])
  );
  const selectedBrainRegionsAndChildren = useAtomValue(selectedBrainRegionsWithChildrenAtom);

  useEffect(() => {
    if (!selectedBrainRegion || !id || !dataBrainRegions || !brainRegions) return;
    if (dataBrainRegions?.[id]) return;
    if (sectionName !== 'explore') return;

    const childrenOfCurrent = lodashMap(brainRegions, 'id');

    let updatedDataBrainRegions: Record<string, string[]>;

    if (selectedBrainRegionsAndChildren.includes(id)) {
      const brainRegionsToRemove = [id, ...childrenOfCurrent];

      // Remove manually selected brainRegions
      updatedDataBrainRegions = omit(dataBrainRegions, brainRegionsToRemove);

      // Remove automatically selected brainRegions (which are present inside the arrays of `dataBrainRegions`)
      Object.entries(updatedDataBrainRegions).forEach(([parent, children]) => {
        if (intersection(children, brainRegionsToRemove).length > 0) {
          updatedDataBrainRegions[parent] = children.filter(
            (child) => !brainRegionsToRemove.includes(child)
          );
        }
      });
    } else {
      updatedDataBrainRegions = { [id]: [...childrenOfCurrent] };
    }

    setDataBrainRegions(updatedDataBrainRegions);
  }, [
    selectedBrainRegion,
    brainRegions,
    dataBrainRegions,
    id,
    selectedBrainRegionsAndChildren,
    setDataBrainRegions,
    sectionName,
  ]);
}

export function useSaveHierarchy() {
  const sectionName = useAtomValue(sectionAtom);
  const selectedBrainRegion = useAtomValue(selectedBrainRegionAtom);
  const brainRegions = useAtomValue(unwrap(brainRegionsAtom));

  useEffect(() => {
    if (!brainRegions || !selectedBrainRegion || !sectionName) return;

    const ancestors = getAncestors(brainRegions, selectedBrainRegion.id);

    const brainRegionHierarchy = generateHierarchyPathTree(
      ancestors.map((ancestor) => Object.keys(ancestor)[0])
    );

    setInitializationValue(DEFAULT_BRAIN_REGION_STORAGE_KEY, {
      ...DEFAULT_BRAIN_REGION,
      value: selectedBrainRegion,
      // keep only the selected region path in the tree
      brainRegionHierarchyState: brainRegionHierarchy ?? {},
    } satisfies DefaultBrainRegionType);
  }, [selectedBrainRegion, brainRegions, sectionName]);
}
