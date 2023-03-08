import _ from 'lodash';
import gustatoryAreas from './data/gustatory-areas.json';
import calculateCompositions, {
  addCompositions,
  addNode,
  iterateNode,
} from '@/util/composition/composition-parser';
import { CalculationLink, CalculationNode } from '@/util/composition/types';

describe('Add compositions', () => {
  it('should calculate the correct addition', () => {
    const totalComposition = {
      neuron: { count: 10, density: 125.6 },
      glia: { count: 0, density: 0 },
    };

    const toAdd = {
      neuron: { count: 25, density: 40.3 },
      glia: { count: 0, density: 0 },
    };
    addCompositions(totalComposition, toAdd);
    expect(totalComposition.neuron.count).toBe(35);
    expect(totalComposition.neuron.density).toBeCloseTo(165.9);
  });
});

describe('Add nodes', () => {
  it('should calculate the correct node addition if node does not exist', () => {
    const nodeToAdd = {
      about: 'MType',
      id: 'test',
      label: 'Test',
      parentId: 'parentId',
      composition: { neuron: { count: 10, density: 30.5 }, glia: { count: 0, density: 0 } },
      leaves: new Set(['leaf1']),
      relatedNodes: new Set(['node1']),
    };
    const totalNodes: { [key: string]: CalculationNode } = {};
    addNode(nodeToAdd, totalNodes);
    expect(totalNodes.test__parentId).not.toBe(undefined);
    expect(totalNodes.test__parentId.composition.neuron.count).toBe(10);
    expect(totalNodes.test__parentId.composition.neuron.density).toBe(30.5);
  });

  it('should calculate the correct node addition if node already exist', () => {
    const nodeToAdd = {
      about: 'MType',
      id: 'test',
      label: 'Test',
      parentId: 'parentId',
      composition: { neuron: { count: 10, density: 30.5 }, glia: { count: 0, density: 0 } },
      leaves: new Set(['leaf1']),
      relatedNodes: new Set(['node1']),
    };

    const existingNode = {
      about: 'MType',
      id: 'test',
      label: 'Test',
      parentId: 'parentId',
      composition: { neuron: { count: 30, density: 50.5 }, glia: { count: 0, density: 0 } },
      leaves: new Set(['leaf2']),
      relatedNodes: new Set(['node2']),
    };

    const totalNodes: { [key: string]: CalculationNode } = {};
    addNode(existingNode, totalNodes);
    addNode(nodeToAdd, totalNodes);
    expect(totalNodes.test__parentId.composition.neuron.count).toBe(40);
    expect(totalNodes.test__parentId.composition.neuron.density).toBe(81);
    expect(totalNodes.test__parentId.leaves).toContain('leaf1');
    expect(totalNodes.test__parentId.leaves).toContain('leaf2');
    expect(totalNodes.test__parentId.relatedNodes).toContain('node1');
    expect(totalNodes.test__parentId.relatedNodes).toContain('node2');
  });
});

describe('Composition Parser unit tests for single region', () => {
  const gal1Id = 'http://api.brain-map.org/api/v2/data/Structure/36';
  const gustatoryAreasLayer1 = gustatoryAreas.hasPart[gal1Id];
  it('total count is calculated correctly', () => {
    const cloneGAL1 = _.cloneDeep(gustatoryAreasLayer1);
    const nodes = {};
    const links = {};
    // @ts-ignore
    const composition = iterateNode(cloneGAL1, gal1Id, nodes, links, gal1Id);
    expect(composition.neuron.count).toBe(3430);
    expect(composition.neuron.density).toBeCloseTo(17438.83);
  });

  it('MType counts is calculated correctly', () => {
    const cloneGAL1 = _.cloneDeep(gustatoryAreasLayer1);
    const nodes: { [key: string]: CalculationNode } = {};
    const links: { [key: string]: CalculationLink } = {};
    // @ts-ignore
    iterateNode(cloneGAL1, gal1Id, nodes, links, gal1Id);
    expect(
      nodes['http://uri.interlex.org/base/ilx_0383192?rev=34__null'].composition.neuron.count
    ).toBe(447);
    expect(
      nodes['http://uri.interlex.org/base/ilx_0383192?rev=34__null'].composition.neuron.density
    ).toBeCloseTo(2272.64);
  });

  it('composition parser returns all nodes and links', () => {
    const cloneGAL1 = _.cloneDeep(gustatoryAreasLayer1);
    const nodes: { [key: string]: CalculationNode } = {};
    const links: { [key: string]: CalculationLink } = {};
    // @ts-ignore
    iterateNode(cloneGAL1, gal1Id, nodes, links, gal1Id);
    expect(Object.values(nodes)).toHaveLength(20);
    expect(Object.values(links)).toHaveLength(14);
  });
});

describe('Calculate compositions unit tests', () => {
  const leafIds = [
    'http://api.brain-map.org/api/v2/data/Structure/36',
    'http://api.brain-map.org/api/v2/data/Structure/187',
  ];

  it('total count is calculated correctly', async () => {
    const areas = _.cloneDeep(gustatoryAreas);
    // @ts-ignore
    const { totalComposition } = await calculateCompositions(areas, leafIds);
    expect(totalComposition.neuron.count).toBe(58137 + 3430);
  });

  it('all nodes and links are returned', async () => {
    const areas = _.cloneDeep(gustatoryAreas);
    // @ts-ignore
    const { nodes, links } = await calculateCompositions(areas, leafIds);
    expect(Object.values(nodes)).toHaveLength(87);
    expect(Object.values(links)).toHaveLength(68);
  });
});
