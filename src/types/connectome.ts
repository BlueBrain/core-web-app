export type WholeBrainConnectivityMatrix = {
  [preBrainRegionId: string]: {
    [postBrainRegionId: string]: number;
  };
};

export type HemisphereDirection = 'LL' | 'LR' | 'RL' | 'RR';
