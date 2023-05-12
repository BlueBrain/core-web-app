import { logError } from '@/util/logger';

/* eslint-disable @typescript-eslint/no-use-before-define */
export type Vector2 = [number, number];
export type Vector3 = [number, number, number];
export type Vector4 = [number, number, number, number];
export type Vector = Vector2 | Vector3 | Vector4;
export type Quaternion = Vector4;

/**
 * Define the smallest cube that contain a 3D object.
 */
export interface BoundingBox {
  /** Coords of the box corner with smallest coords. */
  min: Vector3;
  /** Coords of the box corner with greatest coords. */
  max: Vector3;
}

export interface Axis {
  x: Vector3;
  y: Vector3;
  z: Vector3;
}

export interface Size {
  width: number;
  height: number;
}
export interface Position {
  x: number;
  y: number;
}
export interface SizeAndPos extends Size, Position {}

/**
 * Imagine a plane. The axis are:
 * * X: left/right.
 * * Y: up/down
 * * Z: forward/backward
 */
export interface EulerAngles {
  /** Roll (X) radians (left/right) */
  roll: number;
  /** Yaw (Y) radians (up/down) */
  yaw: number;
  /** Pitch (Z) radians (forward/backward) */
  pitch: number;
}

export function ensureCalcInterface(data: unknown): CalcInterface {
  if (data instanceof CalcInterface) return data;

  logError('Expected SceneManagerInterface but got:', data);
  throw Error('Service is not of type CalcInterface!');
}

export default abstract class CalcInterface {
  /**
   * @returns A point on a Bezier Cubic curve
   * @param p0 First point
   * @param p1 First control point
   * @param p2 Last control point
   * @param p3 Last point
   * @param t Time between 0 (first point) and 1 (last point)
   */
  abstract bezierCubic<T extends Vector>(p0: T, p1: T, p2: T, p3: T, t: number): T;

  /**
   * Compute the size and position of an image that we want to paste on a target
   * so as to cover it entirely and keep image aspect ratio.
   *
   * @param sourceSize Size of the image you want to fit.
   * @param targetSize Area where to fit the source image.
   * @param alignement Float between 0 and 1. This is the percentage of
   * the image that will overflow on the left or on the top.
   * Use 0.5 to get a centered result.
   */
  abstract fitToCover(sourceSize: Size, targetSize: Size, alignement?: number): SizeAndPos;

  abstract dotProduct(vectorA: Vector3, vectorB: Vector3): number;

  abstract crossProduct(vectorA: Vector3, vectorB: Vector3): Vector3;

  abstract addVectors<T extends Vector>(...vectors: T[]): T;

  /**
   * @return a - b
   */
  abstract subVectors<T extends Vector>(a: T, b: T): T;

  /**
   * Multiply each component of the vector by a scalar.
   * @param a
   */
  abstract scaleVector<T extends Vector>(a: T, scale: number): T;

  /**
   * @returns The length of a vector.
   */
  abstract length<T extends Vector>(vector: T): number;

  /**
   * @returns A normalized vector (length === 1)
   */
  abstract normalizeVector<T extends Vector>(vector: T): T;

  /**
   * Compute distance betweeb `pointA` and `pointB`.
   */
  abstract distance<T extends Vector>(pointA: T, pointB: T): number;

  abstract multiplyQuaternions(...quaternions: Quaternion[]): Quaternion;

  /**
   * @param angle Expressed in radians
   * @param axis Vector around which we want to rotation to occur.
   * @returns A quaternion which is a rotation of `angle` radians around
   * the vector `axis`.
   */
  abstract getQuaternionAsAxisRotation(angle: number, axis: Vector3): Quaternion;

  /**
   * @param latitude Latitude in radians.
   * @param longitude Longitude in radians.
   * @param tilt Tilt in radians.
   */
  abstract rotateVectorWithQuaternion(vec: Vector3, quat: Quaternion): Vector3;

  /**
   * Get the X, Y, Z axis of the matrix that maps this orientation.
   * @param quaternion Must be a unit quaternion.
   */
  abstract getAxisFromQuaternion(quaternion: Quaternion): Axis;

  /**
   * Return a normalized quaternion from a rotation matrix.
   */
  abstract getQuaternionFromAxis(axis: Axis): Quaternion;

  /**
   * Rotate a quaternion around an axis.
   * @param quat Quaternion to rotate.
   * @param vec Rotation axis.
   * @param ang Angle in radians.
   */
  abstract rotateQuaternionAroundVector(quat: Quaternion, vec: Vector3, ang: number): Quaternion;

  /**
   * Compute the rotation of `vector` around `axis` of `ang` radians.
   */
  abstract rotateVectorAroundVector(vector: Vector3, axis: Vector3, ang: number): Vector3;

  /**
   * A plan can be defined by a __point__ and a __normal__.
   * The normal is directed to the hemi-space that must be discarded.
   *
   * This representation takes 6 floats.
   * You can also use a normal and a signed distance from the center,
   * which takes only 4 floats. This is how Brayns represent clipping planes.
   */
  abstract plane6to4(
    point: Vector3,
    normal: Vector3
  ): { normal: [number, number, number]; distance: number };

  abstract computeBoundingBoxCenter(boundingBox: { min: Vector3; max: Vector3 }): Vector3;

  /**
   * Compute the union of several bounding boxes.
   */
  abstract computeBoundingBoxesUnion(boundingBoxes: BoundingBox[]): BoundingBox;

  /**
   * @returns `false` if `Math.abs(num1 - num2) > epsilon`
   */
  abstract areEqualFloats(num1: number, num2: number, epsilon?: number): boolean;

  /**
   * @returns `false` if the difference of any component is greater than `epsilon`,
   * or if the vectors have different sizes.
   */
  abstract areEqualVectors(vec1: number[], vec2: number[], epsilon?: number): boolean;

  /**
   * Return a point on the line (a,b) parametrized by `t`.
   *  * If `t === 0` return `a`.
   *  * If `t === 1` return `b`.
   */
  abstract interpolateVectors<T extends number[]>(a: T, b: T, t: number): T;

  /**
   * Linear interpolation with contant speed between two quaternions.
   * @param q1
   * @param q2
   * @param t The result is `q1` when `t === 0` and `q2` when `t === 1`
   */
  abstract slerp(q1: Quaternion, q2: Quaternion, t: number): Quaternion;
}
