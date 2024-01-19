import { readFileSync } from 'node:fs';
import path from 'node:path';
import zLib from 'node:zlib';
import pipe from 'lodash/fp/pipe';
import cloneDeep from 'lodash/cloneDeep';
import { arrayToTree } from 'performant-array-to-tree';
import {
  serializeBrainRegionsAndVolumes,
  serializeBrainRegionOntologyViews,
} from '@/api/ontologies/brain-regions';
import { BrainRegion, BrainRegionOntologyView, BrainViewId } from '@/types/ontologies';
import { buildAlternateChildren, buildAlternateTree } from '@/state/brain-regions/alternate-view';

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

function createDefaultViewTree(data: BrainRegionOntology) {
  return {
    brainRegions: data.brainRegions,
    tree: arrayToTree(data.brainRegions, {
      dataField: null,
      parentId: data.views?.find((view) => view.id === 'https://neuroshapes.org/BrainRegion')
        ?.parentProperty,
      childrenField: 'items',
    })
      .find((region) => region.id === 'http://api.brain-map.org/api/v2/data/Structure/997')
      ?.items?.find(
        (region: BrainRegion) => region.id === 'http://api.brain-map.org/api/v2/data/Structure/8'
      ),
  };
}

function createTreeWithRepresentation({
  brainRegions,
  tree,
}: {
  brainRegions: BrainRegion[];
  tree: BrainRegion;
}) {
  return {
    brainRegions,
    treeWithRepresentation: tree,
  };
}

function checkTreeForAnnotationRepresentation({
  brainRegions,
  treeWithRepresentation,
}: {
  brainRegions: BrainRegion[];
  treeWithRepresentation: BrainRegion[];
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
    treeWithRepresentation.find(
      ({ id }) => id === 'http://api.brain-map.org/api/v2/data/Structure/567'
    )
  );

  test("Whether Ammon's Horn is represented in the annotation volume.", () =>
    expect(ammonsHorn?.representedInAnnotation).toBe(true));

  test("Whether Ammon's Horn has parts that are represented in the annotation volume.", () =>
    expect(ammonsHorn?.itemsInAnnotation).toBe(true));

  return {
    brainRegions,
    treeWithRepresentation,
  };
}

function createAlternateViewTree({
  brainRegions,
  treeWithRepresentation,
}: {
  brainRegions: BrainRegion[];
  treeWithRepresentation: BrainRegion[];
}) {
  const alternateTree = cloneDeep(treeWithRepresentation);

  const alternateChildren = buildAlternateChildren(
    'http://api.brain-map.org/api/v2/data/Structure/375', // Ammon's Horn
    'isLayerPartOf',
    brainRegions,
    'https://bbp.epfl.ch/ontologies/core/bmo/BrainLayer'
  );

  buildAlternateTree(
    alternateTree[2], // "567"
    'http://api.brain-map.org/api/v2/data/Structure/375', // Ammon's Horn
    alternateChildren,
    'https://bbp.epfl.ch/ontologies/core/bmo/BrainLayer'
  );

  return alternateTree;
}

function checkAlternateViewForItemsInAnnotation(alternateTree: BrainRegion[]) {
  const alternateTreeWithRepresentation = alternateTree;

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
    alternateTreeWithRepresentation.find(
      ({ id }) => id === 'http://api.brain-map.org/api/v2/data/Structure/567'
    )
  );

  test("Whether Ammon's Horn has represented parts in the annotation, in the ALTERNATE view.", () => {
    expect(ammonsHorn?.itemsInAnnotation).toBe(false);
  });

  return alternateTree;
}

const readStream = readFileSync(path.resolve(__dirname, 'response.json.br'));

describe('The brain regions hierarchy.', () => {
  pipe(
    zLib.brotliDecompressSync,
    (buffer) => JSON.parse(buffer.toString('utf-8')),
    getBrainRegionOntologyFromRawData,
    mapViewsToBrainRegions,
    createDefaultViewTree,
    createTreeWithRepresentation,
    checkTreeForAnnotationRepresentation,
    createAlternateViewTree,
    checkAlternateViewForItemsInAnnotation
  )(readStream);
});
