import _ from 'lodash';
import gustatory from './data/gustatory-layer-1.json';
import { calculateNewExtendedNodeId } from '@/util/composition/utils';
import { addComposition, calculateRatioSpread } from '@/util/composition/composition-modifier';
import { LeafNode } from '@/types/composition';

describe('calculateNewExtendedNodeId', () => {
  it(`should append the new node id if extended exists`, () => {
    const extendedNodeId = 'http://uri.interlex.org/base/ilx_0383192?rev=34';
    const nodeId = 'http://uri.interlex.org/base/ilx_0738203?rev=28';
    const newExtendedNodeId = calculateNewExtendedNodeId(extendedNodeId, nodeId, 'MType');
    expect(newExtendedNodeId).toBe(
      'http://uri.interlex.org/base/ilx_0383192?rev=34__http://uri.interlex.org/base/ilx_0738203?rev=28'
    );
  });

  it(`should be the node id if extended is null`, () => {
    const nodeId = 'http://uri.interlex.org/base/ilx_0738203?rev=28';
    const newExtendedNodeId = calculateNewExtendedNodeId('', nodeId, 'MType');
    expect(newExtendedNodeId).toBe('http://uri.interlex.org/base/ilx_0738203?rev=28');
  });
});

describe('calculate ratio spread', () => {
  // @ts-ignore
  const node = gustatory['http://api.brain-map.org/api/v2/data/Structure/36'] as LeafNode;
  const modifiedMType = {
    about: 'MType',
    id: 'http://uri.interlex.org/base/ilx_0383192?rev=34',
    label: 'L1_DAC',
    parentId: null,
    neuronComposition: { count: 0, density: 0 },
    leaves: [],
    relatedNodes: [],
  };
  it('should have correct ratio spread', () => {
    const ratioSpread = calculateRatioSpread(node, 'root', modifiedMType, []);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0383192?rev=34']).toBeCloseTo(1);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0383193?rev=34']).toBeCloseTo(0.3992);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0383194?rev=38']).toBeCloseTo(0.029);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0383195?rev=34']).toBeCloseTo(0.2544);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0383196?rev=34']).toBeCloseTo(0.07);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0383197?rev=34']).toBeCloseTo(0.2463);
  });

  it('should have 0 ratio spread if locked', () => {
    const ratioSpread = calculateRatioSpread(node, 'root', modifiedMType, [
      'root__http://uri.interlex.org/base/ilx_0383193?rev=34',
    ]);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0383193?rev=34']).toBeCloseTo(0);
  });

  it('ratio spread is correct if there is locked node on first level', () => {
    const ratioSpread = calculateRatioSpread(node, 'root', modifiedMType, [
      'root__http://uri.interlex.org/base/ilx_0383193?rev=34',
    ]);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0383194?rev=38']).toBeCloseTo(0.049);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0383195?rev=34']).toBeCloseTo(0.423);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0383196?rev=34']).toBeCloseTo(0.1166);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0383197?rev=34']).toBeCloseTo(0.41);
  });

  it('ratio spread is correct if there is locked node on second level', () => {
    // @ts-ignore
    const l1DAC = gustatory['http://api.brain-map.org/api/v2/data/Structure/36'].hasPart[
      'http://uri.interlex.org/base/ilx_0383192?rev=34'
    ] as LeafNode;
    const ratioSpread = calculateRatioSpread(
      l1DAC,
      'root__http://uri.interlex.org/base/ilx_0383192?rev=34',
      modifiedMType,
      [
        'root__http://uri.interlex.org/base/ilx_0383192?rev=34__http://uri.interlex.org/base/ilx_0738201?rev=31',
      ]
    );
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0738203?rev=28']).toBeCloseTo(1);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0738201?rev=31']).toBeCloseTo(0);
  });

  it('ratio spread is spread correctly if previous value is 0', () => {
    const nodeCopy = _.cloneDeep(node.hasPart['http://uri.interlex.org/base/ilx_0383192?rev=34']);
    nodeCopy.hasPart[
      'http://uri.interlex.org/base/ilx_0738203?rev=28'
    ].composition.neuron.count = 0;
    nodeCopy.hasPart[
      'http://uri.interlex.org/base/ilx_0738201?rev=31'
    ].composition.neuron.count = 0;
    const ratioSpread = calculateRatioSpread(
      nodeCopy,
      'root__http://uri.interlex.org/base/ilx_0383192?rev=34',
      modifiedMType,
      []
    );
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0738203?rev=28']).toBeCloseTo(0.5);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0738201?rev=31']).toBeCloseTo(0.5);
  });
});

describe('add composition function', () => {
  // @ts-ignore
  const bnac = gustatory['http://api.brain-map.org/api/v2/data/Structure/36'].hasPart[
    'http://uri.interlex.org/base/ilx_0383192?rev=34'
  ].hasPart['http://uri.interlex.org/base/ilx_0738203?rev=28'] as LeafNode;

  it('should increase count correctly', () => {
    const cloneBnac = _.cloneDeep(bnac);
    const newBnac = addComposition(cloneBnac, 'count', 200);
    expect(newBnac.composition.neuron.count).toBeCloseTo(450);
  });

  it('should increase density in a relative way when increasing count', () => {
    const cloneBnac = _.cloneDeep(bnac);
    const newBnac = addComposition(cloneBnac, 'count', 250);
    expect(newBnac.composition.neuron.density).toBeCloseTo(2542.102);
  });

  it('should increase count in a relative way when increasing density', () => {
    const cloneBnac = _.cloneDeep(bnac);
    const newBnac = addComposition(cloneBnac, 'density', 1271.051);
    expect(newBnac.composition.neuron.count).toBeCloseTo(500);
  });

  it('should have a round count even after adding a not round number', () => {
    const cloneBnac = _.cloneDeep(bnac);
    const newBnac = addComposition(cloneBnac, 'count', 200.345);
    expect(Number.isInteger(newBnac.composition.neuron.count)).toBe(true);
  });

  it('should increase density correctly', () => {
    const cloneBnac = _.cloneDeep(bnac);
    const newBnac = addComposition(cloneBnac, 'density', 200.345);
    expect(newBnac.composition.neuron.density).toBeCloseTo(1471.396);
  });
});
