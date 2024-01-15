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
  getMockBrainRegion('Root Brain Region', '997', '#98E4FF', {
    isPartOf: null,
    hasPart: [`${IDPrefix}/8`],
  }),
  getMockBrainRegion('Basic cell groups and regions', '8', '#BFDAE3', {
    isPartOf: `${IDPrefix}/997`,
    hasPart: [`${IDPrefix}/567`, `${IDPrefix}/512`, `${IDPrefix}/343`],
  }),
  getMockBrainRegion('Brain stem', '343', '#FF7080', {
    isPartOf: `${IDPrefix}/8`,
    hasPart: [`${IDPrefix}/1065`, `${IDPrefix}/1129`, `${IDPrefix}/313`],
  }),
  getMockBrainRegion('Cerebellum', '512', '#F0F080', {
    isPartOf: `${IDPrefix}/8`,
    hasPart: [`${IDPrefix}/528`, `${IDPrefix}/614454453`, `${IDPrefix}/519`],
  }),
  getMockBrainRegion('Cerebrum', '567', '#B0F0FF', {
    isPartOf: `${IDPrefix}/8`,
    hasPart: [`${IDPrefix}/614454562`, `${IDPrefix}/596`],
  }),
  getMockBrainRegion('Cerebral cortex', '688', '#B0FFB8', {
    isPartOf: `${IDPrefix}/567`,
    hasPart: [`${IDPrefix}/695`],
  }),
  getMockBrainRegion('Cortical plate', '695', '#70FF70', {
    isPartOf: `${IDPrefix}/688`,
    hasPart: [`${IDPrefix}/315`],
  }),
  getMockBrainRegion('Isocortex', '315', '#70FF71', { isPartOf: `${IDPrefix}/695` }),
  getMockBrainRegion('Interbrain', '1129', '#FF7080', { isPartOf: `${IDPrefix}/343` }),
];
