/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-use-before-define */
import Hierarchy from './hierarchy.json';
import { assertType } from '@/util/type-guards';
import { logError } from '@/util/logger';

export interface Region {
  acronym: string;
  color: string;
}

class RegionsInfo {
  private readonly regions = new Map<string, Region>();

  constructor() {
    try {
      assertType<{ msg: unknown[] }>(Hierarchy, { msg: ['array', 'unknown'] });
      fillRegionMap(this.regions, Hierarchy.msg);
    } catch (ex) {
      logError('Unable to parse region hierarchy!', ex);
    }
  }

  get(regionID: string): Region | undefined {
    return this.regions.get(regionID);
  }
}

const regionsInfo = new RegionsInfo();

export default regionsInfo;

function fillRegionMap(regions: Map<string, Region>, nodes: unknown[], prefix = 'msg') {
  let index = 0;
  for (const node of nodes) {
    assertType<HierarchyNode>(
      node,
      {
        id: 'number',
        acronym: 'string',
        color_hex_triplet: 'string',
        children: ['?', ['array', 'unknown']],
      },
      `${prefix}[${index}]`
    );
    regions.set(`${node.id}`, { acronym: node.acronym, color: node.color_hex_triplet });
    if (node.children) fillRegionMap(regions, node.children, `${prefix}[${index}].children`);
    index += 1;
  }
}

interface HierarchyNode {
  id: number;
  acronym: string;
  children?: unknown[];
  color_hex_triplet: string;
}
