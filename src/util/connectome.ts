import { MacroConnectomeEditEntry, WholeBrainConnectivityMatrix } from '@/types/connectome';

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
