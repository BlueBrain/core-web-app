import nodes from './data/visceral-area-layer-1.json';
import { calculateMax } from '@/util/composition/utils';

describe('calculateMax', () => {
  it('test correct max calculation for unlocked node and all unlocked nodes', () => {
    const relatedNodeIds = [
      'http://uri.interlex.org/base/ilx_0383192?rev=34',
      'http://uri.interlex.org/base/ilx_0383193?rev=34',
      'http://uri.interlex.org/base/ilx_0383194?rev=38',
      'http://uri.interlex.org/base/ilx_0383195?rev=34',
      'http://uri.interlex.org/base/ilx_0383196?rev=34',
      'http://uri.interlex.org/base/ilx_0383197?rev=34',
    ];

    const allLockedIds: string[] = [];
    const neuronsToNodes = { ...nodes };
    const max = calculateMax(
      relatedNodeIds,
      'http://uri.interlex.org/base/ilx_0383192?rev=34',
      'MType',
      allLockedIds,
      neuronsToNodes
    );
    expect(max).toBe(7623);
  });

  it('test correct max calculation for unlocked node and some locked nodes', () => {
    const relatedNodeIds = [
      'http://uri.interlex.org/base/ilx_0383192?rev=34',
      'http://uri.interlex.org/base/ilx_0383193?rev=34',
      'http://uri.interlex.org/base/ilx_0383194?rev=38',
      'http://uri.interlex.org/base/ilx_0383195?rev=34',
      'http://uri.interlex.org/base/ilx_0383196?rev=34',
      'http://uri.interlex.org/base/ilx_0383197?rev=34',
    ];

    const allLockedIds: string[] = ['http://uri.interlex.org/base/ilx_0383197?rev=34'];
    const neuronsToNodes = { ...nodes };
    const max = calculateMax(
      relatedNodeIds,
      'http://uri.interlex.org/base/ilx_0383192?rev=34',
      'MType',
      allLockedIds,
      neuronsToNodes
    );
    expect(max).toBe(6699);
  });

  it('test correct max calculation for locked node and some locked nodes', () => {
    const relatedNodeIds = [
      'http://uri.interlex.org/base/ilx_0383192?rev=34',
      'http://uri.interlex.org/base/ilx_0383193?rev=34',
      'http://uri.interlex.org/base/ilx_0383194?rev=38',
      'http://uri.interlex.org/base/ilx_0383195?rev=34',
      'http://uri.interlex.org/base/ilx_0383196?rev=34',
      'http://uri.interlex.org/base/ilx_0383197?rev=34',
    ];

    const allLockedIds: string[] = [
      'http://uri.interlex.org/base/ilx_0383192?rev=34',
      'http://uri.interlex.org/base/ilx_0383193?rev=34',
    ];
    const neuronsToNodes = { ...nodes };
    const max = calculateMax(
      relatedNodeIds,
      'http://uri.interlex.org/base/ilx_0383192?rev=34',
      'MType',
      allLockedIds,
      neuronsToNodes
    );
    expect(max).toBe(3654);
  });
});
