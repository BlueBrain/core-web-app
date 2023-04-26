import { BrainRegionIdx } from './common';

export type HemisphereDirection = 'LL' | 'LR' | 'RL' | 'RR';

export type WholeBrainConnectivityMatrix = Record<HemisphereDirection, Float64Array>;

export interface MacroConnectomeEditEntry {
  name: string;
  hemisphereDirection: HemisphereDirection;
  offset: number;
  multiplier: number;
  target: {
    src: BrainRegionIdx[];
    dst: BrainRegionIdx[];
  };
}
