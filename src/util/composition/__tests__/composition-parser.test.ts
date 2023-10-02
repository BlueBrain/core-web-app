import multipleCompositions from './data/multiple-compositions.json';
import calculateCompositions, {
  addCountPairs,
  addNode,
  convertCompositionToCountPair,
  convertCountPairToComposition,
  iterateNode,
} from '@/util/composition/composition-parser';
import { CalculationLink, CalculationNode, CountPair } from '@/types/composition/calculation';
import { OriginalCompositionPair } from '@/types/composition/original';

describe('count pair to composition converter', () => {
  it('should convert the count pair correctly', () => {
    const countPair: CountPair = { neuron: 500, glia: 0 };
    const composition = convertCountPairToComposition(countPair, 2);
    expect(composition.neuron.density).toBe(250);
    expect(composition.glia.density).toBe(0);
  });

  it('should convert the count pair correctly', () => {
    const countPair: CountPair = { neuron: 0, glia: 100 };
    const composition = convertCountPairToComposition(countPair, 2);
    expect(composition.neuron.density).toBe(0);
    expect(composition.glia.density).toBe(50);
  });
});

describe('densityToTotalCount converter', () => {
  it('should convert the correct number if neuron value', () => {
    const composition: OriginalCompositionPair = {
      neuron: { density: 10 },
      glia: { density: 0 },
    };
    const totalCount = convertCompositionToCountPair(composition, 0.5);
    expect(totalCount.neuron).toBe(5);
    expect(totalCount.glia).toBe(0);
  });

  it('should convert the correct number if glia value', () => {
    const composition = {
      neuron: { density: 0, count: 0 },
      glia: { density: 20, count: 0 },
    };
    const totalCount = convertCompositionToCountPair(composition, 0.5);
    expect(totalCount.neuron).toBe(0);
    expect(totalCount.glia).toBe(10);
  });
});

describe('addCountPairs', () => {
  it('should calculate the correct addition', () => {
    const totalCountPair = {
      neuron: 10,
      glia: 0,
    };

    const toAdd = {
      neuron: 20,
      glia: 0,
    };
    const calculatedCountPair = addCountPairs(totalCountPair, toAdd);
    expect(calculatedCountPair.neuron).toBe(30);
    expect(calculatedCountPair.glia).toBeCloseTo(0);
  });
});

describe('Add nodes', () => {
  it('should calculate the correct node addition if node does not exist', () => {
    const nodeToAdd: CalculationNode = {
      about: 'MType',
      id: 'test',
      extendedNodeId: 'test',
      label: 'Test',
      parentId: 'parentId',
      countPair: { neuron: 10, glia: 0 },
      leaves: ['leaf1'],
      relatedNodes: ['node1'],
    };
    const totalNodes: { [key: string]: CalculationNode } = {};
    addNode(nodeToAdd, totalNodes);
    expect(totalNodes.parentId__test).not.toBe(undefined);
    expect(totalNodes.parentId__test.countPair.neuron).toBe(10);
  });

  it('should calculate the correct node addition if node already exist', () => {
    const nodeToAdd: CalculationNode = {
      about: 'MType',
      id: 'test',
      extendedNodeId: 'test',
      label: 'Test',
      parentId: 'parentId',
      countPair: { neuron: 10, glia: 0 },
      leaves: ['leaf1'],
      relatedNodes: ['node1'],
    };

    const existingNode: CalculationNode = {
      about: 'MType',
      id: 'test',
      extendedNodeId: 'test',
      label: 'Test',
      parentId: 'parentId',
      countPair: { neuron: 30, glia: 0 },
      leaves: ['leaf2'],
      relatedNodes: ['node2'],
    };

    const totalNodes: { [key: string]: CalculationNode } = {};
    addNode(existingNode, totalNodes);
    addNode(nodeToAdd, totalNodes);
    expect(totalNodes.parentId__test.countPair.neuron).toBe(40);
    expect(totalNodes.parentId__test.leaves).toContain('leaf1');
    expect(totalNodes.parentId__test.leaves).toContain('leaf2');
    expect(totalNodes.parentId__test.relatedNodes).toContain('node1');
    expect(totalNodes.parentId__test.relatedNodes).toContain('node2');
  });
});

describe('Composition Parser unit tests for single region', () => {
  const singleCompId = 'http://api.brain-map.org/api/v2/data/Structure/36';
  const compToTest = multipleCompositions.hasPart['36'];

  it('total count is calculated correctly', () => {
    const nodes = {};
    const links = {};
    const composition = iterateNode(
      // @ts-ignore
      compToTest,
      singleCompId,
      nodes,
      links,
      singleCompId,
      '',
      0.5
    );
    expect(composition.neuron).toBeCloseTo(105);
  });

  it('MType counts is calculated correctly', () => {
    const nodes: { [key: string]: CalculationNode } = {};
    const links: { [key: string]: CalculationLink } = {};
    // @ts-ignore
    iterateNode(compToTest, singleCompId, nodes, links, singleCompId, '', 0.5);
    expect(nodes.A.countPair.neuron).toBe(15);
    expect(nodes.C__I.countPair.neuron).toBe(30);
  });

  it('should calculate the correct extended node ids', () => {
    // @ts-ignore
    const nodes: { [key: string]: CalculationNode } = {};
    const links: { [key: string]: CalculationLink } = {};
    // @ts-ignore
    iterateNode(compToTest, singleCompId, nodes, links, singleCompId, '', 0.5);
    expect(nodes.A__D.extendedNodeId).toBe('A__D');
  });

  it('composition parser returns all nodes and links', () => {
    // @ts-ignore
    const nodes: { [key: string]: CalculationNode } = {};
    const links: { [key: string]: CalculationLink } = {};
    // @ts-ignore
    iterateNode(compToTest, singleCompId, nodes, links, singleCompId, '', 0.5);
    expect(Object.values(nodes)).toHaveLength(9);
    expect(Object.values(links)).toHaveLength(6);
  });
});

describe('Calculate compositions unit tests', () => {
  const leafIds = ['36', '10'];
  const volumes = { '5': 0.75, '36': 0.5, '10': 0.25 };

  it('total count is calculated correctly', async () => {
    const { totalComposition } = await calculateCompositions(
      // @ts-ignore
      multipleCompositions,
      '5',
      leafIds,
      volumes
    );
    expect(totalComposition.neuron?.count).toBe(130);
    expect(totalComposition.neuron?.density).toBeCloseTo(173.333);
  });

  it('all nodes and links are returned', async () => {
    const { nodes, links } = await calculateCompositions(
      // @ts-ignore
      multipleCompositions,
      '5',
      leafIds,
      volumes
    );
    expect(Object.values(nodes)).toHaveLength(11);
    expect(Object.values(links)).toHaveLength(8);
  });
});
