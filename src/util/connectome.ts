import {
  Utf8,
  Uint8,
  Uint16,
  Dictionary,
  DictionaryBuilder,
  Float64,
  Float64Builder,
  Table,
} from '@apache-arrow/es5-cjs';

import {
  MacroConnectomeEditEntry,
  MicroConnectomeEditEntry,
  PathwaySideSelection,
  SerialisibleMicroConnectomeEditEntry,
  SerialisiblePathwaySideSelection,
  WholeBrainConnectivityMatrix,
} from '@/types/connectome';
import { BrainRegion } from '@/types/ontologies';
import { HEMISPHERE_DIRECTIONS } from '@/constants/connectome';

export function getFlatArrayValueIdx(totalLeaves: number, srcIdx: number, dstIdx: number) {
  return srcIdx * totalLeaves + dstIdx;
}

export function applyConnectivityMatrixEdit(
  matrix: WholeBrainConnectivityMatrix,
  edit: MacroConnectomeEditEntry
) {
  const flatArray = matrix[edit.hemisphereDirection];
  const matrixSize = Math.sqrt(flatArray.length);

  edit.target.src.forEach((srcIdx) => {
    edit.target.dst.forEach((dstIdx) => {
      const idx = getFlatArrayValueIdx(matrixSize, srcIdx, dstIdx);
      const value = flatArray[idx];
      // eslint-disable-next-line no-param-reassign
      flatArray[idx] = value * edit.multiplier + edit.offset;
    });
  });
}

/**
 * Compute a diff between two connectivity matrices
 * and create overrides table in Apache Arrow format
 */
export function createMacroConnectomeOverridesTable(
  brainRegionLeaves: BrainRegion[],
  initialMatrix: WholeBrainConnectivityMatrix,
  currentMatrix: WholeBrainConnectivityMatrix
) {
  const totalLeaves = brainRegionLeaves.length;

  const sideBuilder = new DictionaryBuilder({
    type: new Dictionary(new Utf8(), new Uint8()),
  });

  const sourceRegionBuilder = new DictionaryBuilder({
    type: new Dictionary(new Utf8(), new Uint16()),
  });

  const targetRegionBuilder = new DictionaryBuilder({
    type: new Dictionary(new Utf8(), new Uint16()),
  });

  const valueBuilder = new Float64Builder({ type: new Float64() });

  HEMISPHERE_DIRECTIONS.forEach((hemisphereDirection) => {
    const initialFlatArray = initialMatrix[hemisphereDirection];
    const flatArray = currentMatrix[hemisphereDirection];

    brainRegionLeaves.forEach((srcBrainRegion, srcIdx) => {
      brainRegionLeaves.forEach((dstBrainRegion, dstIdx) => {
        const idx = getFlatArrayValueIdx(totalLeaves, srcIdx, dstIdx);
        if (initialFlatArray[idx] !== flatArray[idx]) {
          sideBuilder.append(hemisphereDirection);
          sourceRegionBuilder.append(srcBrainRegion.notation);
          targetRegionBuilder.append(dstBrainRegion.notation);
          valueBuilder.append(flatArray[idx]);
        }
      });
    });
  });

  const sideVector = sideBuilder.finish().toVector();
  const sourceRegionVector = sourceRegionBuilder.finish().toVector();
  const targetRegionVector = targetRegionBuilder.finish().toVector();

  const valueVector = valueBuilder.toVector();

  const overridesTable = new Table({
    side: sideVector,
    source_region: sourceRegionVector,
    target_region: targetRegionVector,
    value: valueVector,
  });

  return overridesTable;
}

export function toSerialisibleSelection(selection: PathwaySideSelection) {
  const serialisibleSelection: SerialisiblePathwaySideSelection = {
    ...selection,
    mtypeFilterSet: selection.mtypeFilterSet
      ? Array.from(selection.mtypeFilterSet).sort()
      : undefined,
  };

  return serialisibleSelection;
}

export function fromSerialisibleSelection(serialisibeSelection: SerialisiblePathwaySideSelection) {
  const selection: PathwaySideSelection = {
    ...serialisibeSelection,
    mtypeFilterSet: serialisibeSelection.mtypeFilterSet
      ? new Set(serialisibeSelection.mtypeFilterSet)
      : undefined,
  };

  return selection;
}

export function toSerialisibleEdit(
  edit: MicroConnectomeEditEntry
): SerialisibleMicroConnectomeEditEntry {
  return {
    ...edit,
    srcSelection: toSerialisibleSelection(edit.srcSelection),
    dstSelection: toSerialisibleSelection(edit.dstSelection),
  };
}

export function fromSerialisibleEdit(
  serialisibleEdit: SerialisibleMicroConnectomeEditEntry
): MicroConnectomeEditEntry {
  return {
    ...serialisibleEdit,
    srcSelection: fromSerialisibleSelection(serialisibleEdit.srcSelection),
    dstSelection: fromSerialisibleSelection(serialisibleEdit.dstSelection),
  } as MicroConnectomeEditEntry;
}
