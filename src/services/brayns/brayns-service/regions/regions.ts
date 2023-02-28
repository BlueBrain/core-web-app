/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-use-before-define */
import Hierarchy from './hierarchy.json';
import { assertType } from '@/util/type-guards';
import { logError } from '@/util/logger';

export interface Region {
  acronym: string;
}

class RegionsInfo {
  private readonly regions = new Map<number, Region>();

  constructor() {
    try {
      assertType<{ msg: unknown[] }>(Hierarchy, { msg: ['array', 'unknown'] });
      fillRegionMap(this.regions, Hierarchy.msg);
    } catch (ex) {
      logError('Unable to parse region hierarchy!', ex);
    }
  }

  get(regionID: number): Region | undefined {
    return this.regions.get(regionID);
  }
}

const regionsInfo = new RegionsInfo();

export default regionsInfo;

function fillRegionMap(regions: Map<number, Region>, nodes: unknown[], prefix = 'msg') {
  let index = 0;
  for (const node of nodes) {
    assertType<HierarchyNode>(
      node,
      {
        id: 'number',
        acronym: 'string',
        children: ['?', ['array', 'unknown']],
      },
      `${prefix}[${index}]`
    );
    regions.set(node.id, { acronym: node.acronym });
    if (node.children) fillRegionMap(regions, node.children, `${prefix}[${index}].children`);
    index += 1;
  }
}

interface HierarchyNode {
  id: number;
  acronym: string;
  children?: unknown[];
}
