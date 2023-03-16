import _ from 'lodash';
import gustatory from './data/gustatory-layer-1.json';
import testComposition from './data/test-composition.json';
import { calculateNewExtendedNodeId } from '@/util/composition/utils';
import computeModifiedComposition, {
  calculateDensityRatioChange,
  calculateRatioSpread,
  findParentOfAffected,
  iterateAndApplyDensityChange,
  calculateAndApplyDensityChange,
  applyNewDensity,
} from '@/util/composition/composition-modifier';
import { Composition, CompositionNode, LeafNode } from '@/types/composition';

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
  const node = gustatory as LeafNode;
  const modifiedMType = {
    about: 'MType',
    id: 'http://uri.interlex.org/base/ilx_0383192?rev=34',
    label: 'L1_DAC',
    parentId: null,
    neuronComposition: { count: 0, density: 0 },
    leaves: [],
    relatedNodes: [],
    extendedNodeId: 'http://uri.interlex.org/base/ilx_0383192?rev=34',
  };
  it('should have correct ratio spread', () => {
    const ratioSpread = calculateRatioSpread(node, '', modifiedMType, []);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0383192?rev=34']).toBeCloseTo(1);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0383193?rev=34']).toBeCloseTo(0.3992);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0383194?rev=38']).toBeCloseTo(0.029);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0383195?rev=34']).toBeCloseTo(0.2544);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0383196?rev=34']).toBeCloseTo(0.07);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0383197?rev=34']).toBeCloseTo(0.2463);
  });

  it('should have 0 ratio spread if locked', () => {
    const ratioSpread = calculateRatioSpread(node, '', modifiedMType, [
      'http://uri.interlex.org/base/ilx_0383193?rev=34',
    ]);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0383193?rev=34']).toBeCloseTo(0);
  });

  it('ratio spread is correct if there is locked node on first level', () => {
    const ratioSpread = calculateRatioSpread(node, '', modifiedMType, [
      'http://uri.interlex.org/base/ilx_0383193?rev=34',
    ]);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0383194?rev=38']).toBeCloseTo(0.049);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0383195?rev=34']).toBeCloseTo(0.423);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0383196?rev=34']).toBeCloseTo(0.1166);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0383197?rev=34']).toBeCloseTo(0.41);
  });

  it('ratio spread is correct if there is locked node on second level', () => {
    // @ts-ignore
    const l1DAC = gustatory.hasPart['http://uri.interlex.org/base/ilx_0383192?rev=34'] as LeafNode;
    const ratioSpread = calculateRatioSpread(
      l1DAC,
      'http://uri.interlex.org/base/ilx_0383192?rev=34',
      modifiedMType,
      [
        'http://uri.interlex.org/base/ilx_0383192?rev=34__http://uri.interlex.org/base/ilx_0738201?rev=31',
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
      'http://uri.interlex.org/base/ilx_0383192?rev=34',
      modifiedMType,
      []
    );
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0738203?rev=28']).toBeCloseTo(0.5);
    expect(ratioSpread['http://uri.interlex.org/base/ilx_0738201?rev=31']).toBeCloseTo(0.5);
  });
});

describe('findParentOfAffected', () => {
  // @ts-ignore
  const testBrainRegion = _.cloneDeep(testComposition.hasPart.brainregion1) as LeafNode;
  it('should find the correct node if in the first level of the tree', () => {
    const node = findParentOfAffected('mtype1', testBrainRegion);
    expect(node?.label).toBe('Test Brain Region1');
  });

  it('should find the correct node if in the second level of the tree', () => {
    const node = findParentOfAffected('mtype1__etype1', testBrainRegion);
    expect(node?.label).toBe('MTYPE1');
  });

  it('should find the correct node if in the second level of the tree', () => {
    const node = findParentOfAffected('mtype1__etype2', testBrainRegion);
    expect(node?.label).toBe('MTYPE1');
  });
});

describe('calculateDensityRatioChange', () => {
  it('should have correct ratio when increasing the value', () => {
    const change = calculateDensityRatioChange(300, 600);
    expect(change).toBe(2);
  });

  it('should have correct ratio when decreasing the value', () => {
    const change = calculateDensityRatioChange(600, 300);
    expect(change).toBe(0.5);
  });

  it('should have correct ratio when the previous density is 0', () => {
    const change = calculateDensityRatioChange(0, 300);
    expect(change).toBe(300);
  });
});

describe('applyNewDensity', () => {
  it('should have correct new density applied', () => {
    const nodeToModify = {
      composition: {
        neuron: {
          density: 300,
          count: 500,
        },
      },
    } as LeafNode;

    applyNewDensity(nodeToModify, 0.5, 0.2);
    expect(nodeToModify.composition.neuron.density).toBeCloseTo(150);
    expect(nodeToModify.composition.neuron.count).toBeCloseTo(30);
  });

  it('should have correct new density applied when previous density is 0', () => {
    const nodeToModify = {
      composition: {
        neuron: {
          density: 0,
          count: 0,
        },
      },
    } as LeafNode;

    applyNewDensity(nodeToModify, 300, 0.2);
    expect(nodeToModify.composition.neuron.density).toBeCloseTo(300);
    expect(nodeToModify.composition.neuron.count).toBeCloseTo(60);
  });
});

describe('iterateAndApplyDensityChange', () => {
  it('should calculate correct density change', () => {
    const testBrainRegion = _.cloneDeep(testComposition.hasPart.brainregion1);
    const copyTestBR = _.cloneDeep(testBrainRegion);
    // @ts-ignore
    const mtype1 = copyTestBR.hasPart.mtype1 as LeafNode;
    iterateAndApplyDensityChange(mtype1, 0.5, 0.2);
    expect(mtype1.hasPart.etype1.composition.neuron.density).toBeCloseTo(125);
    expect(mtype1.hasPart.etype1.composition.neuron.count).toBeCloseTo(25);
    expect(mtype1.hasPart.etype2.composition.neuron.density).toBeCloseTo(175);
    expect(mtype1.hasPart.etype2.composition.neuron.count).toBeCloseTo(35);
  });
});

describe('calculateAndApplyDensityChange', () => {
  it('should calculate the correct overall density change when changing first level', () => {
    const testBrainRegion = _.cloneDeep(testComposition.hasPart.brainregion1);
    const copyTestBR = _.cloneDeep(testBrainRegion);
    const modifiedNode = {
      id: 'mtype1',
      extendedNodeId: 'mtype1',
      neuronComposition: {
        density: 600,
      },
    } as CompositionNode;
    // @ts-ignore
    calculateAndApplyDensityChange(modifiedNode, copyTestBR, 0.5, []);
    expect(copyTestBR.hasPart.mtype1.hasPart.etype1.composition.neuron.density).toBe(125);
    expect(copyTestBR.hasPart.mtype1.hasPart.etype2.composition.neuron.density).toBe(175);
    expect(copyTestBR.hasPart.mtype2.hasPart.etype3.composition.neuron.density).toBe(350);
    expect(copyTestBR.hasPart.mtype3.hasPart.etype4.composition.neuron.density).toBe(175);
    expect(copyTestBR.hasPart.mtype3.hasPart.etype5.composition.neuron.density).toBe(175);
  });

  it('should calculate the correct overall density change when changing second level', () => {
    const testBrainRegion = _.cloneDeep(testComposition.hasPart.brainregion1);
    const copyTestBR = _.cloneDeep(testBrainRegion);
    const modifiedNode = {
      id: 'etype2',
      extendedNodeId: 'mtype1__etype2',
      neuronComposition: {
        density: 350,
      },
    } as CompositionNode;
    // @ts-ignore
    calculateAndApplyDensityChange(modifiedNode, copyTestBR.hasPart.mtype1, 0.5, []);
    expect(copyTestBR.hasPart.mtype1.hasPart.etype1.composition.neuron.density).toBe(425);
    expect(copyTestBR.hasPart.mtype1.hasPart.etype2.composition.neuron.density).toBe(175);
    expect(copyTestBR.hasPart.mtype2.hasPart.etype3.composition.neuron.density).toBe(200);
    expect(copyTestBR.hasPart.mtype3.hasPart.etype4.composition.neuron.density).toBe(100);
    expect(copyTestBR.hasPart.mtype3.hasPart.etype5.composition.neuron.density).toBe(100);
  });

  it('should calculate the correct overall density change when locked ids of first level', () => {
    const testBrainRegion = _.cloneDeep(testComposition.hasPart.brainregion1);
    const copyTestBR = _.cloneDeep(testBrainRegion);
    const modifiedNode = {
      id: 'mtype1',
      extendedNodeId: 'mtype1',
      neuronComposition: {
        density: 600,
      },
    } as CompositionNode;
    // @ts-ignore
    calculateAndApplyDensityChange(modifiedNode, copyTestBR, 0.5, ['mtype2']);
    expect(copyTestBR.hasPart.mtype1.hasPart.etype1.composition.neuron.density).toBe(125);
    expect(copyTestBR.hasPart.mtype1.hasPart.etype2.composition.neuron.density).toBe(175);
    expect(copyTestBR.hasPart.mtype2.hasPart.etype3.composition.neuron.density).toBe(200);
    expect(copyTestBR.hasPart.mtype3.hasPart.etype4.composition.neuron.density).toBe(250);
    expect(copyTestBR.hasPart.mtype3.hasPart.etype5.composition.neuron.density).toBe(250);
  });
});

describe('computeModifiedComposition', () => {
  it('should calculate the correct overall density change when decreasing value by half', () => {
    // @ts-ignore
    const copyComposition = _.cloneDeep(testComposition) as Composition;
    const modifiedNode = {
      id: 'mtype1',
      composition: 900,
      extendedNodeId: 'mtype1',
    } as CompositionNode;
    // @ts-ignore
    computeModifiedComposition(
      modifiedNode,
      -450,
      ['brainregion1', 'brainregion2'],
      copyComposition,
      [],
      'density',
      { brainregion: 0.2 },
      'brainregion'
    );
    expect(
      copyComposition.hasPart.brainregion1.hasPart.mtype1.hasPart.etype1.composition.neuron.density
    ).toBeCloseTo(125);
    expect(
      copyComposition.hasPart.brainregion1.hasPart.mtype1.hasPart.etype2.composition.neuron.density
    ).toBeCloseTo(175);
    expect(
      copyComposition.hasPart.brainregion1.hasPart.mtype2.hasPart.etype3.composition.neuron.density
    ).toBeCloseTo(350);
    expect(
      copyComposition.hasPart.brainregion1.hasPart.mtype3.hasPart.etype4.composition.neuron.density
    ).toBeCloseTo(175);
    expect(
      copyComposition.hasPart.brainregion1.hasPart.mtype3.hasPart.etype5.composition.neuron.density
    ).toBeCloseTo(175);
    // second brain region
    expect(
      copyComposition.hasPart.brainregion2.hasPart.mtype1.hasPart.etype1.composition.neuron.density
    ).toBeCloseTo(50);
    expect(
      copyComposition.hasPart.brainregion2.hasPart.mtype1.hasPart.etype2.composition.neuron.density
    ).toBeCloseTo(100);
    expect(
      copyComposition.hasPart.brainregion2.hasPart.mtype2.hasPart.etype3.composition.neuron.density
    ).toBeCloseTo(350);
  });

  it('should calculate the correct overall density change when increasing value', () => {
    // @ts-ignore
    const copyComposition = _.cloneDeep(testComposition) as Composition;
    const modifiedNode = {
      id: 'mtype1',
      composition: 900,
      extendedNodeId: 'mtype1',
    } as CompositionNode;
    // @ts-ignore
    computeModifiedComposition(
      modifiedNode,
      100,
      ['brainregion1', 'brainregion2'],
      copyComposition,
      [],
      'density',
      { brainregion: 0.2 },
      'brainregion'
    );
    expect(
      copyComposition.hasPart.brainregion1.hasPart.mtype1.hasPart.etype1.composition.neuron.density
    ).toBeCloseTo(277.777);
    expect(
      copyComposition.hasPart.brainregion1.hasPart.mtype1.hasPart.etype2.composition.neuron.density
    ).toBeCloseTo(388.888);
    expect(
      copyComposition.hasPart.brainregion1.hasPart.mtype2.hasPart.etype3.composition.neuron.density
    ).toBeCloseTo(166.666);
    expect(
      copyComposition.hasPart.brainregion1.hasPart.mtype3.hasPart.etype4.composition.neuron.density
    ).toBeCloseTo(83.333);
    expect(
      copyComposition.hasPart.brainregion1.hasPart.mtype3.hasPart.etype5.composition.neuron.density
    ).toBeCloseTo(83.333);
    // // second brain region
    expect(
      copyComposition.hasPart.brainregion2.hasPart.mtype1.hasPart.etype1.composition.neuron.density
    ).toBeCloseTo(111.111);
    expect(
      copyComposition.hasPart.brainregion2.hasPart.mtype1.hasPart.etype2.composition.neuron.density
    ).toBeCloseTo(222.222);
    expect(
      copyComposition.hasPart.brainregion2.hasPart.mtype2.hasPart.etype3.composition.neuron.density
    ).toBeCloseTo(166.666);
  });

  it('should calculate the correct overall density change when decreasing value of second level', () => {
    // @ts-ignore
    const copyComposition = _.cloneDeep(testComposition) as Composition;
    const modifiedNode = {
      id: 'etype2',
      extendedNodeId: 'mtype1__etype2',
      composition: 350,
    } as CompositionNode;
    // @ts-ignore
    computeModifiedComposition(
      modifiedNode,
      -175,
      ['brainregion1'],
      copyComposition,
      [],
      'density',
      { brainregion: 0.2 },
      'brainregion'
    );
    expect(
      copyComposition.hasPart.brainregion1.hasPart.mtype1.hasPart.etype1.composition.neuron.density
    ).toBeCloseTo(425);
    expect(
      copyComposition.hasPart.brainregion1.hasPart.mtype1.hasPart.etype2.composition.neuron.density
    ).toBeCloseTo(175);
    expect(
      copyComposition.hasPart.brainregion1.hasPart.mtype2.hasPart.etype3.composition.neuron.density
    ).toBeCloseTo(200);
    expect(
      copyComposition.hasPart.brainregion1.hasPart.mtype3.hasPart.etype4.composition.neuron.density
    ).toBeCloseTo(100);
    expect(
      copyComposition.hasPart.brainregion1.hasPart.mtype3.hasPart.etype5.composition.neuron.density
    ).toBeCloseTo(100);
  });
});
