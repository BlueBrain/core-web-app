export type HemisphereDirection = 'LL' | 'LR' | 'RL' | 'RR';

export type WholeBrainConnectivityMatrix = Record<HemisphereDirection, Float64Array>;

export type Edit = {
  name: string;
  hemisphereDirection: HemisphereDirection;
  offset: number;
  multiplier: number;
  selection: [string[], string[]];
};
