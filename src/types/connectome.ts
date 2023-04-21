export type HemisphereDirection = 'LL' | 'LR' | 'RL' | 'RR';

export type WholeBrainConnectivityMatrix = Record<HemisphereDirection, Float64Array>
