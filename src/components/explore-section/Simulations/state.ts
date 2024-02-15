import { atom } from 'jotai';
import clone from 'lodash/clone';
import memoizeOne from 'memoize-one';
import {
  Dimension,
  DimensionRange,
  DimensionValue,
} from '@/components/explore-section/Simulations/types';
import { AxesState } from '@/types/explore-section/misc';
import { detailFamily } from '@/state/explore-section/detail-view-atoms';
import { Simulation } from '@/types/explore-section/delta-simulation-campaigns';
import { pathToResource } from '@/util/explore-section/detail-view';

// Dimensions atoms

function buildDefaultDimensions(resource: Simulation) {
  return resource.parameter?.coords
    ? Object.entries(resource.parameter?.coords).map(([id, values]) => {
        const value: number = (values as Array<number>)[0];

        return {
          id,
          value: { type: 'value', value: value?.toString() },
        } as Dimension;
      })
    : null;
}

export const dimensionsAtom = atom<Dimension[] | null>([]);

export const initializeDimensionsFamily = memoizeOne((path: string) =>
  atom(null, async (get, set) => {
    const resource: Simulation | undefined = (await get(detailFamily(pathToResource(path))))

    if (resource) {
      const defaultDimensions = buildDefaultDimensions(resource);

      set(dimensionsAtom, defaultDimensions);
    }

    return undefined;
  })
);

export const modifyDimensionValue = atom<null, [string, DimensionValue | DimensionRange], void>(
  null,
  (get, set, title, newValue) => {
    const dimensions = get(dimensionsAtom);
    const dimensionIndex = dimensions?.findIndex((dim) => dim.id === title);

    if (dimensionIndex !== -1 && dimensionIndex !== undefined && dimensions) {
      dimensions[dimensionIndex].value = newValue;
      set(dimensionsAtom, [...dimensions]);
    }
  }
);

export const axesAtom = atom<AxesState>({
  xAxis: undefined,
  yAxis: undefined,
});

export const selectedXDimensionAtom = atom<Dimension | undefined>((get) => {
  const dimensions = get(dimensionsAtom);
  const axes = get(axesAtom);

  if (dimensions && axes.xAxis) {
    return clone(dimensions.find((dim) => dim.id === axes.xAxis));
  }

  return undefined;
});

export const selectedYDimensionAtom = atom<Dimension | undefined>((get) => {
  const dimensions = get(dimensionsAtom);
  const axes = get(axesAtom);

  if (dimensions && axes.yAxis) {
    return clone(dimensions.find((dim) => dim.id === axes.yAxis));
  }

  return undefined;
});

export const otherDimensionsAtom = atom<Dimension[] | undefined>((get) => {
  const dimensions = get(dimensionsAtom);
  const axes = get(axesAtom);

  if (dimensions) {
    return dimensions.filter((dim) => dim.id !== axes.xAxis && dim.id !== axes.yAxis);
  }

  return undefined;
});
