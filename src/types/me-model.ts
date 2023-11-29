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

/* --------------------------- DefaultPlaceholders -------------------------- */

export type DefaultPlaceholders = {
  hasPart: {
    [brainRegionId: string]: {
      about: 'BrainRegion';
      notation: string;
      label: string;
      hasPart: {
        [mTypeId: string]: {
          about: 'MType';
          label: string;
          hasPart: {
            [eTypeId: string]: {
              about: 'EType';
              label: string;
              hasPart: DefaultEModelPlaceholder;
            };
          };
        };
      };
    };
  };
};

export type DefaultEModelPlaceholder = {
  [eModelId: string]: {
    about: 'EModel';
    _rev: number;
  };
};

export type DefaultMEModelType = {
  mePairValue: [string, string];
  eModelValue: EModelMenuItem;
  brainRegionId: string;
};
