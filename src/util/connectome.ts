import { Utf8, Utf8Builder, Float64, Float64Builder, Table } from '@apache-arrow/es5-cjs';

import { MacroConnectomeEditEntry, WholeBrainConnectivityMatrix } from '@/types/connectome';
import { BrainRegion } from '@/types/ontologies';
import { hemisphereDirections } from '@/constants/connectome';

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

  const sideBuilder = new Utf8Builder({ type: new Utf8() });
  const srcBuilder = new Utf8Builder({ type: new Utf8() });
  const dstBuilder = new Utf8Builder({ type: new Utf8() });

  const valueBuilder = new Float64Builder({ type: new Float64() });

  hemisphereDirections.forEach((hemisphereDirection) => {
    const initialFlatArray = initialMatrix[hemisphereDirection];
    const flatArray = currentMatrix[hemisphereDirection];

    brainRegionLeaves.forEach((srcBrainRegion, srcIdx) => {
      brainRegionLeaves.forEach((dstBrainRegion, dstIdx) => {
        const idx = getFlatArrayValueIdx(totalLeaves, srcIdx, dstIdx);
        if (initialFlatArray[idx] !== flatArray[idx]) {
          sideBuilder.append(hemisphereDirection);
          srcBuilder.append(srcBrainRegion.notation);
          dstBuilder.append(dstBrainRegion.notation);
          valueBuilder.append(flatArray[idx]);
        }
      });
    });
  });

  const sideVector = sideBuilder.finish().toVector();
  const srcVector = srcBuilder.finish().toVector();
  const dstVector = dstBuilder.finish().toVector();

  const valueVector = valueBuilder.toVector();

  const overridesTable = new Table({
    side: sideVector,
    src: srcVector,
    dst: dstVector,
    value: valueVector,
  });

  return overridesTable;
}
