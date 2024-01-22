import { readFileSync } from 'node:fs';
import path from 'node:path';
import zLib from 'node:zlib';
import pipe from 'lodash/fp/pipe';
import { arrayToTree } from 'performant-array-to-tree';
import {
  serializeBrainRegionsAndVolumes,
  serializeBrainRegionOntologyViews,
} from '@/api/ontologies/brain-regions';
import { BrainRegion, BrainRegionOntologyView, BrainViewId } from '@/types/ontologies';
import { getInAnnotationBrainRegionsReducer } from '@/util/brain-hierarchy';
import {
  BASIC_CELL_GROUPS_AND_REGIONS_ID,
  ROOT_BRAIN_REGION_URI,
} from '@/constants/brain-hierarchy';

type Volumes = { [key: string]: number };

type HasHierarchyViewRaw = {
  '@id': BrainViewId;
  description: string;
  hasChildrenHierarchyProperty: string;
  hasLeafHierarchyProperty: string;
  hasParentHierarchyProperty: string;
  label: string;
}[];

type BrainRegionOntology = {
  brainRegions: BrainRegion[];
  views: BrainRegionOntologyView[] | null;
  volumes: Volumes;
};

function getBrainRegionOntologyFromRawData(data: {
  defines: any[];
  hasHierarchyView: HasHierarchyViewRaw;
}) {
  const { defines, hasHierarchyView } = data;
  const { brainRegions, volumes } = serializeBrainRegionsAndVolumes(defines);

  return {
    brainRegions,
    views: hasHierarchyView ? serializeBrainRegionOntologyViews(hasHierarchyView) : null,
    volumes,
  };
}

function mapViewsToBrainRegions(data: BrainRegionOntology) {
  const { brainRegions, ...rest } = data;

  return {
    brainRegions: brainRegions.map((brainRegion) => ({
      ...brainRegion,
      view: 'https://neuroshapes.org/BrainRegion',
    })),
    ...rest,
  };
}

function keepRepresentedInAnnotion({
  brainRegions,
  ...rest
}: BrainRegionOntology): BrainRegionOntology {
  const inAnnotationBrainRegionsReducer = getInAnnotationBrainRegionsReducer(brainRegions);

  return {
    brainRegions: brainRegions?.reduce<BrainRegion[]>(inAnnotationBrainRegionsReducer, []),
    ...rest,
  };
}

function createDefaultViewTree(data: BrainRegionOntology): {
  brainRegions: BrainRegion[];
  treeWithRepresentation: BrainRegion[] | null;
} {
  let treeWithRepresentation;

  const tree = arrayToTree(data.brainRegions, {
    dataField: null,
    parentId: data.views?.find((view) => view.id === 'https://neuroshapes.org/BrainRegion')
      ?.parentProperty,
    childrenField: 'items',
  }) as BrainRegion[];

  if (tree.length > 0) {
    // find the root and select the new root
    const newRoot = tree
      .find((region: BrainRegion) => region.id === ROOT_BRAIN_REGION_URI)
      ?.items?.find((region: BrainRegion) => region.id === BASIC_CELL_GROUPS_AND_REGIONS_ID);
    treeWithRepresentation = newRoot ? [newRoot] : null;
  } else {
    treeWithRepresentation = tree;
  }

  return {
    brainRegions: data.brainRegions,
    treeWithRepresentation,
  };
}

function checkTreeForAnnotationRepresentation({
  brainRegions,
  treeWithRepresentation,
}: {
  brainRegions: BrainRegion[];
  treeWithRepresentation: BrainRegion[] | null;
}) {
  const pathToAmmonsHorn = [
    'http://api.brain-map.org/api/v2/data/Structure/688',
    'http://api.brain-map.org/api/v2/data/Structure/695',
    'http://api.brain-map.org/api/v2/data/Structure/1089',
    'http://api.brain-map.org/api/v2/data/Structure/1080',
    'http://api.brain-map.org/api/v2/data/Structure/375',
  ];

  const ammonsHorn = pathToAmmonsHorn.reduce(
    (tree: BrainRegion | undefined, brainRegionId) =>
      tree?.items?.find(({ id: itemId }: { id: string }) => itemId === brainRegionId),
    treeWithRepresentation?.find(
      ({ id }) => id === 'http://api.brain-map.org/api/v2/data/Structure/567'
    )
  );

  test("Whether Ammon's Horn is represented in the tree.", () => expect(ammonsHorn).toBeTruthy());

  return {
    brainRegions,
    treeWithRepresentation,
  };
}

const readStream = readFileSync(path.resolve(__dirname, 'response.json.br'));

describe('The brain regions hierarchy.', () => {
  pipe(
    zLib.brotliDecompressSync,
    (buffer) => JSON.parse(buffer.toString('utf-8')),
    getBrainRegionOntologyFromRawData,
    mapViewsToBrainRegions,
    keepRepresentedInAnnotion,
    createDefaultViewTree,
    checkTreeForAnnotationRepresentation
  )(readStream);
});
