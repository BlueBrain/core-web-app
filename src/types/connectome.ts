import { BrainRegionIdx, Merge } from './common';

export type HemisphereDirection = 'LL' | 'LR' | 'RL' | 'RR';

export type WholeBrainConnectivityMatrix = Record<HemisphereDirection, Float64Array>;

interface PathwaySideSelectionBase {
  brainRegionNotation: string;
  mtype?: string;
}

export interface PathwaySideSelection extends PathwaySideSelectionBase {
  mtypeFilterSet?: Set<string>;
}

export interface SerialisiblePathwaySideSelection extends PathwaySideSelectionBase {
  mtypeFilterSet?: string[];
}

export interface MacroConnectomeEditEntry {
  name: string;
  hemisphereDirection: HemisphereDirection;
  offset: number;
  multiplier: number;
  target: {
    // TODO update prop names to be consistent with arrow naming: source and target
    src: BrainRegionIdx[];
    dst: BrainRegionIdx[];
  };
}

interface MicroConnectomeEditEntryBase {
  name: string;
  id: string;
  hemisphereDirection: HemisphereDirection;
  srcSelection: PathwaySideSelection;
  dstSelection: PathwaySideSelection;
}

interface MicroConnectomeSetAlgorithmEditEntryBase {
  operation: 'setAlgorithm';
  variantName: string;
  params: {
    [paramName: string]: number;
  };
}

interface MicroConnectomeModifyParamsEditEntryBase {
  operation: 'modifyParams';
  variantName: string;
  params: {
    [paramName: string]: {
      offset: number;
      multiplier: number;
    };
  };
}

export interface MicroConnectomeSetAlgorithmEditEntry
  extends MicroConnectomeEditEntryBase,
    MicroConnectomeSetAlgorithmEditEntryBase {}
export interface MicroConnectomeModifyParamsEditEntry
  extends MicroConnectomeEditEntryBase,
    MicroConnectomeModifyParamsEditEntryBase {}

export type MicroConnectomeEditEntry =
  | MicroConnectomeSetAlgorithmEditEntry
  | MicroConnectomeModifyParamsEditEntry;

export type SerialisibleMicroConnectomeEditEntry = Merge<
  MicroConnectomeEditEntry,
  {
    srcSelection: SerialisiblePathwaySideSelection;
    dstSelection: SerialisiblePathwaySideSelection;
  }
>;
