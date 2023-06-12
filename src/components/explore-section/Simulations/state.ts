import { atom } from 'jotai';
import clone from 'lodash/clone';
import {
  Dimension,
  DimensionRange,
  DimensionValue,
} from '@/components/explore-section/Simulations/types';
import { AxesState, SimulationCampaignResource } from '@/types/explore-section';
import { simulationCampaignResourceAtom } from '@/state/explore-section/simulation-campaign';

// Dimensions atoms

function buildDefaultDimensions(resource: SimulationCampaignResource) {
  return Object.keys(resource.coords).map(
    (dimension) =>
      ({
        id: dimension,
        value: { type: 'range', minValue: '0.2', maxValue: '0.4' },
      } as Dimension)
  );
}

export const dimensionsAtom = atom<Dimension[]>([]);

export const initializeDimensionsAtom = atom(null, (get, set) => {
  const resource = get(simulationCampaignResourceAtom);
  if (resource) {
    const defaultDimensions = buildDefaultDimensions(resource);
    set(dimensionsAtom, defaultDimensions);
  }
  return undefined;
});

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
