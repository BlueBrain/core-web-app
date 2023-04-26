/* eslint-disable import/prefer-default-export */
export function getFlatArrayValueIdx (totalLeaves: number, srcIdx: number, dstIdx: number) {
  return (srcIdx * totalLeaves) + dstIdx;
};
