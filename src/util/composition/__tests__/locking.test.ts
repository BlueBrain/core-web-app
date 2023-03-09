import _ from 'lodash';
import infra from './data/infralimbic-area-layer-1.json';
import lateral from './data/lateral-reticular-nucleus-composition.json';
import { CompositionNode } from '@/types/composition';
import analyseComposition from '@/util/composition/composition-parser';
import iterateAndComputeSystemLockedIds, {
  computeSystemLockedIds,
  findUnlockedSiblings,
} from '@/util/composition/locking';

describe('findUnlockedSiblings', () => {
  const nodes = infra as CompositionNode[];
  const groupByParent = _.groupBy(nodes, (node) => node.parentId);
  const nullParent = groupByParent.null;
  it('', () => {
    const userLockedIds = [
      'http://uri.interlex.org/base/ilx_0383193?rev=34',
      'http://uri.interlex.org/base/ilx_0383194?rev=38',
      'http://uri.interlex.org/base/ilx_0383195?rev=34',
      'http://uri.interlex.org/base/ilx_0383196?rev=34',
      'http://uri.interlex.org/base/ilx_0383197?rev=34',
    ];
    const { countLocked, unlockedIds } = findUnlockedSiblings(nullParent, userLockedIds);
    expect(countLocked).toBe(5);
    expect(unlockedIds).toContain('http://uri.interlex.org/base/ilx_0383192?rev=34');
  });
});

describe('Test system locking', () => {
  const nodes = infra as CompositionNode[];
  it(`Test rule No2: If All the children of a node are locked, the parent is locked as well`, () => {
    const userLockedIds = [
      'http://uri.interlex.org/base/ilx_0383192?rev=34__http://uri.interlex.org/base/ilx_0738203?rev=28',
      'http://uri.interlex.org/base/ilx_0383192?rev=34__http://uri.interlex.org/base/ilx_0738201?rev=31',
    ];
    const systemLockedIds = computeSystemLockedIds(nodes, userLockedIds);
    expect(systemLockedIds).toContain('http://uri.interlex.org/base/ilx_0383192?rev=34');
  });

  it(`Test rule No3: if a parent gets locked by the user, its children are locked as well`, () => {
    const userLockedIds = ['http://uri.interlex.org/base/ilx_0383192?rev=34'];
    const systemLockedIds = computeSystemLockedIds(nodes, userLockedIds);
    expect(systemLockedIds).toContain(
      'http://uri.interlex.org/base/ilx_0383192?rev=34__http://uri.interlex.org/base/ilx_0738203?rev=28'
    );
    expect(systemLockedIds).toContain(
      'http://uri.interlex.org/base/ilx_0383192?rev=34__http://uri.interlex.org/base/ilx_0738201?rev=31'
    );
  });

  it(`Test rule No1: If the node has children and all its siblings are locked, it gets locked`, () => {
    const userLockedIds = [
      'http://uri.interlex.org/base/ilx_0383193?rev=34',
      'http://uri.interlex.org/base/ilx_0383194?rev=38',
      'http://uri.interlex.org/base/ilx_0383195?rev=34',
      'http://uri.interlex.org/base/ilx_0383196?rev=34',
      'http://uri.interlex.org/base/ilx_0383197?rev=34',
    ];
    const systemLockedIds = computeSystemLockedIds(nodes, userLockedIds);
    expect(systemLockedIds).toContain('http://uri.interlex.org/base/ilx_0383192?rev=34');
  });
});

describe('Test iterative locking', () => {
  it('should return correct amount of locked nodes', async () => {
    // @ts-ignore
    const { nodes, blockedNodeIds } = await analyseComposition(lateral, [
      'http://api.brain-map.org/api/v2/data/Structure/963',
      'http://api.brain-map.org/api/v2/data/Structure/955',
    ]);
    const systemLockedIds = iterateAndComputeSystemLockedIds(nodes, [...blockedNodeIds]);
    expect(systemLockedIds).toHaveLength(4);
  });
});
