import _ from 'lodash';
import infra from './data/infralimbic-area-layer-1.json';
import computeSystemLockedIds, { findUnlockedSiblings } from '@/util/composition/locking';
import { CompositionNode } from '@/types/composition';

describe('findUnlockedSiblings', () => {
  const nodes = infra as CompositionNode[];
  const groupByParent = _.groupBy(nodes, (node) => node.parentId);
  const nullParent = groupByParent.null;
  it('', () => {
    const userLockedIds = [
      'root__http://uri.interlex.org/base/ilx_0383193?rev=34',
      'root__http://uri.interlex.org/base/ilx_0383194?rev=38',
      'root__http://uri.interlex.org/base/ilx_0383195?rev=34',
      'root__http://uri.interlex.org/base/ilx_0383196?rev=34',
      'root__http://uri.interlex.org/base/ilx_0383197?rev=34',
    ];
    const { countLocked, unlockedIds } = findUnlockedSiblings(nullParent, userLockedIds);
    expect(countLocked).toBe(5);
    expect(unlockedIds).toContain('root__http://uri.interlex.org/base/ilx_0383192?rev=34');
  });
});

describe('Test system locking', () => {
  const nodes = infra as CompositionNode[];
  it(`Test rule No2: If All the children of a node are locked, the parent is locked as well`, () => {
    const userLockedIds = [
      'root__http://uri.interlex.org/base/ilx_0383192?rev=34__http://uri.interlex.org/base/ilx_0738203?rev=28',
      'root__http://uri.interlex.org/base/ilx_0383192?rev=34__http://uri.interlex.org/base/ilx_0738201?rev=31',
    ];
    const systemLockedIds = computeSystemLockedIds(nodes, userLockedIds);
    expect(systemLockedIds).toContain('root__http://uri.interlex.org/base/ilx_0383192?rev=34');
  });

  it(`Test rule No3: if a parent gets locked by the user, its children are locked as well`, () => {
    const userLockedIds = ['root__http://uri.interlex.org/base/ilx_0383192?rev=34'];
    const systemLockedIds = computeSystemLockedIds(nodes, userLockedIds);
    expect(systemLockedIds).toContain(
      'root__http://uri.interlex.org/base/ilx_0383192?rev=34__http://uri.interlex.org/base/ilx_0738203?rev=28'
    );
    expect(systemLockedIds).toContain(
      'root__http://uri.interlex.org/base/ilx_0383192?rev=34__http://uri.interlex.org/base/ilx_0738201?rev=31'
    );
  });

  it(`Test rule No1: If the node has children and all its siblings are locked, it gets locked`, () => {
    const userLockedIds = [
      'root__http://uri.interlex.org/base/ilx_0383193?rev=34',
      'root__http://uri.interlex.org/base/ilx_0383194?rev=38',
      'root__http://uri.interlex.org/base/ilx_0383195?rev=34',
      'root__http://uri.interlex.org/base/ilx_0383196?rev=34',
      'root__http://uri.interlex.org/base/ilx_0383197?rev=34',
    ];
    const systemLockedIds = computeSystemLockedIds(nodes, userLockedIds);
    expect(systemLockedIds).toContain('root__http://uri.interlex.org/base/ilx_0383192?rev=34');
  });
});
