import { BrainRegion } from '@/types/ontologies';

const IDPrefix = 'http://api.brain-map.org/api/v2/data/Structure';

const getMockBrainRegion = (
  name: string,
  id: string,
  colorCode: string = '#40A666',
  extra: Partial<BrainRegion> = {}
): BrainRegion => ({
  id: `${IDPrefix}/${id}`,
  colorCode,
  title: name,
  isPartOf: `${IDPrefix}/48`,
  isLayerPartOf: null,
  notation: 'ACAv5',
  representedInAnnotation: true,
  view: 'https://neuroshapes.org/BrainRegion',
  hasLayerPart: [],
  hasPart: [],
  items: undefined,
  ...extra,
  // items: isRoot ? [getMockBrainRegion('Roots child', '8', '#000')] : undefined
});

export const mockBrainRegions: BrainRegion[] = [
  getMockBrainRegion('Anterior cingulate area, ventral part, layer 5', '1', '#0802A3', {
    isPartOf: `${IDPrefix}/8`,
  }),
  getMockBrainRegion('Agranular insular area, posterior part, layer 2', '2', '#FF4B91', {
    isPartOf: `${IDPrefix}/8`,
  }),
  getMockBrainRegion('Isocortex', '3', '#FF7676', { isPartOf: `${IDPrefix}/8` }),
  getMockBrainRegion('Ventral posterolateral nucleus of the thalamus', '718', '#FFCD4B', {
    isPartOf: `${IDPrefix}/8`,
  }),
  getMockBrainRegion('Cerebrum', '6', '#98E4FF', { isPartOf: `${IDPrefix}/8` }),
  getMockBrainRegion('Child of root', '8', '#000', { isPartOf: `${IDPrefix}/997` }),
  getMockBrainRegion('Root Brain Region', '997', '#98E4FF', {
    isPartOf: null,
    isLayerPartOf: null,
    hasPart: [`${IDPrefix}/8`],
  }),
];
