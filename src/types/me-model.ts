import type { EModelMenuItem, MEModelMenuItem } from './e-model';

export type { MEModelMenuItem };

/* -------------------------------- Features -------------------------------- */

export type MEFeatureKeys = 'somaDiameter' | 'yyy';

export type MEFeatureProps = {
  displayName: string;
  range: [number, number]; // min - max
  step: number;
  selectedRange: [number, number]; // min - max
};

export type MEFeatureWithEModel = {
  [key in MEFeatureKeys]: MEFeatureProps & {
    eModel: EModelMenuItem | null;
  };
};
