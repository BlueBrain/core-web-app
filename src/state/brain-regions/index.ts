import { atom } from 'jotai';
import { arrayToTree } from 'performant-array-to-tree';
import cloneDeep from 'lodash/cloneDeep';
import sessionAtom from '@/state/session';
import {
  BrainRegion,
  BrainRegionOntology,
  BrainRegionOntologyView,
  Mesh,
} from '@/types/ontologies';
import { CompositionUnit } from '@/types/composition';
import { getBrainRegionOntology, getDistributions } from '@/api/ontologies';
import { buildAlternateChildren, buildAlternateTree } from '@/state/brain-regions/alternate-view';
import { SelectedBrainRegion } from '@/state/brain-regions/types';
import {
  compositionHistoryAtom,
  compositionHistoryIndexAtom,
} from '@/state/build-composition/composition-history';

/*
  Atom dependency graph


 ┌───────────────────────────────────┐    ┌──────────────────────────────┐    ┌─────────────────────┐
 │    brainRegionsFilteredArrayAtom  ├────► brainRegionsFilteredTreeAtom ├────►   brainRegionsAtom  │
 └───────────────────────────────────┘    └──────────────────────────────┘    └─────────────────────┘

 ┌─────────────────────────┐    ┌────────────────────────────┐
 │ selectedBrainRegionAtom │    │ setSelectedBrainRegionAtom │
 └───────────▲─────────────┘    └────────────────────────────┘
             │
 ┌───────────┴────────────┐    ┌────────────────────────────────┐
 │ InitialCompositionAtom ├────► CompositionOverridesConfigAtom │
 └───────────▲────────────┘    └────────────────────────────────┘
             │
 ┌───────────┴────────────┐    ┌────────────────────────────────┐   ┌──────────────────────┐
 │    CompositionAtom     ├────►     UpdatedCompositionAtom     │   │  SetCompositionAtom  │
 └────────────────────────┘    └────────────────────────────────┘   └──────────────────────┘


 ┌───┐
 │   │ - Atoms
 └───┘

  ───► - Dependencies


   Details:
   * CompositionOverridesConfigAtom holds a composition overrides to be consumed by the workflow
   * InitialCompositionAtom's contains atlas composition with applied overrides (previously saved by the user)
*/

export const densityOrCountAtom = atom<keyof CompositionUnit>('count');

/**
 * Recursively unravels a brain region tree to an array
 * @param brainRegion
 * @param result
 * @param ancestors
 */
const treeToArray = (brainRegion: BrainRegion, result: BrainRegion[], ancestors: string[]) => {
  brainRegion.items?.forEach((br) => {
    const newRegion = { ...br };
    delete newRegion.items;
    const newAncestors = [...ancestors, brainRegion.id];
    newRegion.ancestors = newAncestors;
    result.push(newRegion);
    treeToArray(br, result, newAncestors);
  });
};

const brainRegionOntologyAtom = atom<Promise<BrainRegionOntology | null>>(async (get) => {
  const session = get(sessionAtom);
  if (!session) return null;
  return getBrainRegionOntology(session.accessToken);
});

export const brainRegionOntologyViewsAtom = atom<Promise<BrainRegionOntologyView[] | null>>(
  async (get) => {
    const brainRegionOntology = await get(brainRegionOntologyAtom);
    if (!brainRegionOntology) {
      return null;
    }
    return brainRegionOntology.views;
  }
);

export const brainRegionOntologyVolumesAtom = atom<Promise<{ [key: string]: number } | null>>(
  async (get) => {
    const brainRegionOntology = await get(brainRegionOntologyAtom);
    if (!brainRegionOntology) {
      return null;
    }
    return brainRegionOntology.volumes;
  }
);

export const defaultBrainRegionOntologyViewAtom = atom<
  Promise<BrainRegionOntologyView | null | undefined>
>(async (get) => {
  const views = await get(brainRegionOntologyViewsAtom);
  if (!views) return null;
  return views.find((view) => view.id === 'https://neuroshapes.org/BrainRegion');
});

export const brainRegionsAtom = atom<Promise<BrainRegion[] | null>>(async (get) => {
  const brainRegionOntology = await get(brainRegionOntologyAtom);
  if (!brainRegionOntology) {
    return null;
  }
  const brainRegionsWithViews = [...brainRegionOntology.brainRegions];
  brainRegionsWithViews.forEach((br) => {
    // eslint-disable-next-line no-param-reassign
    br.view = 'https://neuroshapes.org/BrainRegion';
  });

  return brainRegionsWithViews;
});

export const brainRegionsFilteredTreeAtom = atom<Promise<BrainRegion[] | null>>(async (get) => {
  const brainRegions = await get(brainRegionsAtom);
  const defaultView = await get(defaultBrainRegionOntologyViewAtom);
  if (!brainRegions || !defaultView) return null;

  const tree = arrayToTree(brainRegions, {
    dataField: null,
    parentId: defaultView?.parentProperty,
    childrenField: 'items',
  }) as BrainRegion[];
  // if the tree is successfully created, make region 8 the root and flatten it
  // back to array. This is done in order to remove the brain regions that are
  // siblings or parents of region 8
  if (tree.length > 0) {
    // find the root and select the new root
    const newRoot = tree
      .find((region: BrainRegion) => region.id === '997')
      ?.items?.find((region: BrainRegion) => region.id === '8');
    return newRoot ? [newRoot] : null;
  }
  return tree;
});

export const selectedAlternateViews = atom<{ [id: string]: string }>({});

export const brainRegionsAlternateTreeAtom = atom<Promise<BrainRegion[] | null | undefined>>(
  async (get) => {
    const brainRegions = await get(brainRegionsAtom);
    const defaultTree = await get(brainRegionsFilteredTreeAtom);
    const views = await get(brainRegionOntologyViewsAtom);
    const selectedViews = get(selectedAlternateViews);

    const alternateTree = cloneDeep(defaultTree);
    // iterate over the currently modified views and apply the alternative children
    Object.entries(selectedViews).forEach(([brainRegionId, viewId]) => {
      const view = views?.find((v) => v.id === viewId);
      if (view && brainRegions && alternateTree) {
        // first get the children of the brain region id based on the applied view
        const alternateChildren = buildAlternateChildren(
          brainRegionId,
          view.parentProperty,
          brainRegions,
          viewId
        );
        // then replace the children of the changed node with the new ones
        buildAlternateTree(alternateTree[0], brainRegionId, alternateChildren, viewId);
      }
    });
    return alternateTree;
  }
);

export const addOrRemoveSelectedAlternateView = atom(
  null,
  async (get, set, viewId: string, brainRegionId: string) => {
    const selectedViews = get(selectedAlternateViews);
    const brainRegionViews = await get(brainRegionOntologyViewsAtom);
    const defaultView = await get(defaultBrainRegionOntologyViewAtom);
    if (brainRegionViews && viewId && brainRegionId) {
      // if selecting the default view, remove it
      // in any other case, add it
      if (viewId === defaultView?.id && brainRegionId in selectedViews) {
        delete selectedViews[brainRegionId];
      } else {
        selectedViews[brainRegionId] = viewId;
      }
      set(selectedAlternateViews, { ...selectedViews });
    }
  }
);

/**
 * This atom returns the filtered brain regions as array
 */
export const brainRegionsFilteredArrayAtom = atom<Promise<BrainRegion[] | null | undefined>>(
  async (get) => {
    const tree = await get(brainRegionsFilteredTreeAtom);
    // if the tree is successfully created, make region 8 the root and flatten it
    // back to array. This is done in order to remove the brain regions that are
    // siblings or parents of region 8
    if (tree) {
      const root = { ...tree[0] };
      if (root) {
        const flattenedRegions: BrainRegion[] = [];
        treeToArray(root, flattenedRegions, []);
        delete root.items;
        return flattenedRegions.sort((a, b) => a.id.localeCompare(b.id));
      }
    }
    return tree;
  }
);

export const meshDistributionsAtom = atom<Promise<{ [id: string]: Mesh } | null>>(async (get) => {
  const session = get(sessionAtom);

  if (!session) return null;
  return getDistributions(session.accessToken);
});

export const selectedBrainRegionAtom = atom<SelectedBrainRegion | null>(null);
export const selectedPreBrainRegionsAtom = atom(new Map<string, string>());
export const selectedPostBrainRegionsAtom = atom(new Map<string, string>());

export const setSelectedBrainRegionAtom = atom(
  null,
  (
    _get,
    set,
    selectedBrainRegionId: string,
    selectedBrainRegionTitle: string,
    selectedBrainRegionLeaves: string[] | null,
    selectedBrainRegionRepresentedInAnnotation: boolean
  ) => {
    set(selectedBrainRegionAtom, {
      id: selectedBrainRegionId,
      title: selectedBrainRegionTitle,
      leaves: selectedBrainRegionLeaves,
      representedInAnnotation: selectedBrainRegionRepresentedInAnnotation,
    });
    set(compositionHistoryAtom, []);
    set(compositionHistoryIndexAtom, 0);
  }
);

export const setSelectedPreBrainRegionAtom = atom(null, (get, set, id: string, title: string) => {
  const selections = new Map(get(selectedPreBrainRegionsAtom));

  if (selections.has(id)) selections.delete(id);
  else selections.set(id, title);

  set(selectedPreBrainRegionsAtom, selections);
});

export const setSelectedPostBrainRegionAtom = atom(null, (get, set, id: string, title: string) => {
  const selections = new Map(get(selectedPostBrainRegionsAtom));

  if (selections.has(id)) selections.delete(id);
  else selections.set(id, title);

  set(selectedPostBrainRegionsAtom, selections);
});
