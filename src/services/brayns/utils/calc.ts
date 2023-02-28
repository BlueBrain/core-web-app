/* eslint-disable @typescript-eslint/no-use-before-define */
export type Vector2 = [number, number];

export type Vector3 = [number, number, number];

export type Vector4 = [number, number, number, number];

export type Quaternion = Vector4;

export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function half(value: number): number {
  return 0.5 * value;
}

export const DEGREES_PER_RADIAN = 180 / Math.PI;

export const RADIANS_PER_DEGREE = Math.PI / 180;
