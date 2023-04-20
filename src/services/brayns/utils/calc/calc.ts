/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  Euler as ThreeEuler,
  Quaternion as ThreeQuaternion,
  Vector3 as ThreeVector3,
  Matrix4 as ThreeMatrix4,
} from 'three';

import CalcInterface, {
  Axis,
  BoundingBox,
  EulerAngles,
  Quaternion,
  Size,
  SizeAndPos,
  Vector,
  Vector3,
  Vector4,
} from './types';

/* eslint-disable class-methods-use-this */

const EPSILON = 1e-9;
const HALF = 0.5;

/**
 * Quaternion in Brayns Renderer are expressed as a 4 dimensional vector:
 * [x, y, z, w] for q = w + xi + yj + zk
 */
class Calc extends CalcInterface {
  /**
   * Small value used to compare floats.
   */
  public static EPSILON = EPSILON;

  clamp(value: number, min: number, max: number): number {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  bezierCubic<T extends number[]>(p0: T, p1: T, p2: T, p3: T, t: number): T {
    const w = 1 - t;
    const w2 = w * w;
    const w3 = w2 * w;
    const t2 = t * t;
    const t3 = t2 * t;
    return p0.map((a, i) => {
      const b = p1[i];
      const c = p2[i];
      const d = p3[i];
      return w3 * a + 3 * w2 * t * b + 3 * w * t2 * c + t3 * d;
    }) as T;
  }

  computeBoundingBoxCenter(boundingBox: { min: Vector3; max: Vector3 }): Vector3 {
    const [xa, ya, za] = boundingBox.min;
    const [xb, yb, zb] = boundingBox.max;
    return [half(xa + xb), half(ya + yb), half(za + zb)];
  }

  computeBoundingBoxesUnion(boundingBoxes: BoundingBox[]): BoundingBox {
    if (boundingBoxes.length < 1) return { min: [0, 0, 0], max: [0, 0, 0] };
    if (boundingBoxes.length === 1) return boundingBoxes[0];
    const [first, ...rest] = boundingBoxes;
    let [minX, minY, minZ]: Vector3 = [...first.min];
    let [maxX, maxY, maxZ]: Vector3 = [...first.max];
    for (const bbox of rest) {
      const [x0, y0, z0] = bbox.min;
      minX = Math.min(minX, x0);
      minY = Math.min(minY, y0);
      minZ = Math.min(minZ, z0);
      const [x1, y1, z1] = bbox.max;
      maxX = Math.max(maxX, x1);
      maxY = Math.max(maxY, y1);
      maxZ = Math.max(maxZ, z1);
    }
    return {
      min: [minX, minY, minZ],
      max: [maxX, maxY, maxZ],
    };
  }

  multiplyQuaternions(...quaternions: Vector4[]): Vector4 {
    if (quaternions.length === 1) return quaternions[0];

    const [first, second, ...rest] = quaternions;
    const MINIMUM_NB_QUAT_FOR_MULTIPLICATION = 2;
    if (quaternions.length > MINIMUM_NB_QUAT_FOR_MULTIPLICATION) {
      return this.multiplyQuaternions(this.multiplyQuaternions(first, second), ...rest);
    }

    const [qx, qy, qz, qw] = first;
    const [rx, ry, rz, rw] = second;
    return [
      rw * qx + rx * qw - ry * qz + rz * qy,
      rw * qy + rx * qz + ry * qw - rz * qx,
      rw * qz - rx * qy + ry * qx + rz * qw,
      rw * qw - rx * qx - ry * qy - rz * qz,
    ];
  }

  getAxisFromQuaternion(quaternion: Quaternion): Axis {
    const [qx, qy, qz, qw] = this.normalizeVector(quaternion);
    const qx2 = qx * qx;
    const qy2 = qy * qy;
    const qz2 = qz * qz;
    const qxy = qx * qy;
    const qxz = qx * qz;
    const qxw = qx * qw;
    const qyz = qy * qz;
    const qyw = qy * qw;
    const qzw = qz * qw;
    return {
      x: [1 - 2 * (qz2 + qy2), 2 * (qxy + qzw), 2 * (qxz - qyw)],
      y: [2 * (qxy - qzw), 1 - 2 * (qz2 + qx2), 2 * (qyz + qxw)],
      z: [2 * (qyw + qxz), 2 * (qyz - qxw), 1 - 2 * (qy2 + qx2)],
    };
  }

  rotateVectorWithQuaternion([vx, vy, vz]: Vector3, [qx, qy, qz, qw]: Vector4): Vector3 {
    const quaternion = new ThreeQuaternion(qx, qy, qz, qw);
    const vector = new ThreeVector3(vx, vy, vz);
    vector.applyQuaternion(quaternion);
    return [vector.x, vector.y, vector.z];
  }

  getQuaternionFromAxis({ x: axisX, y: axisY, y: axisZ }: Axis): Vector4 {
    const quaternion = new ThreeQuaternion();
    const matrix = new ThreeMatrix4();
    const [n11, n21, n31] = axisX;
    const [n12, n22, n32] = axisY;
    const [n13, n23, n33] = axisZ;
    // prettier-ignore
    matrix.set(
      n11, n12, n13, 0,
      n21, n22, n23, 0,
      n31, n32, n33, 0,
      0,     0,   0, 1
    );
    quaternion.setFromRotationMatrix(matrix);
    return [quaternion.x, quaternion.y, quaternion.z, quaternion.w];
  }

  // getQuaternionFromAxis(axis: Axis): Quaternion {
  //   throw Error('Calc.getQuaternionFromAxis() is not implemented yet!');
  //   // const mtx = new Math3D.Matrix3();
  //   // mtx.setColumn(COLUMN_X, axis.x);
  //   // mtx.setColumn(COLUMN_Y, axis.y);
  //   // mtx.setColumn(COLUMN_Z, axis.z);
  //   // const quat = new Math3D.Quaternion().fromMatrix3(mtx).normalize();
  //   // return [quat.x, quat.y, quat.z, quat.w];
  // }

  /**
   * __Warning!__ This function is not working yet.
   */
  getQuaternionFromEulerAngles({
    yaw: longitude,
    pitch: latitude,
    roll: tilt,
  }: EulerAngles): Quaternion {
    // @see https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles#Euler_angles_to_quaternion_conversion
    const halfYaw = half(longitude);
    const halfPitch = half(latitude);
    const halfRoll = half(tilt);
    const cy = Math.cos(halfYaw);
    const sy = Math.sin(halfYaw);
    const cp = Math.cos(halfPitch);
    const sp = Math.sin(halfPitch);
    const cr = Math.cos(halfRoll);
    const sr = Math.sin(halfRoll);
    const qw = cr * cp * cy + sr * sp * sy;
    const qx = sr * cp * cy - cr * sp * sy;
    const qy = cr * sp * cy + sr * cp * sy;
    const qz = cr * cp * sy - sr * sp * cy;
    return [qx, qy, qz, qw];
  }

  /**
   * __Warning!__ This function is not working yet.
   */
  getEulerAnglesFromQuaternion(quaternion: Vector4): EulerAngles {
    const threeQuaternion = new ThreeQuaternion(...quaternion);
    const ORDER = 'XZY';
    const vectorEuler = new ThreeEuler(0, 0, 0, ORDER);
    vectorEuler.setFromQuaternion(threeQuaternion, ORDER);
    return {
      roll: vectorEuler.x,
      pitch: vectorEuler.y,
      yaw: vectorEuler.z,
    };
  }

  getQuaternionAsAxisRotation(angle: number, axis: Vector3): Quaternion {
    const halfAngle = half(angle);
    const c = Math.cos(halfAngle);
    const s = Math.sin(halfAngle);
    const [x, y, z] = this.normalizeVector(axis);
    return [x * s, y * s, z * s, c];
  }

  rotateQuaternionAroundVector(quaternion: Quaternion, vector: Vector3, angle: number): Quaternion {
    const axis = this.getAxisFromQuaternion(quaternion);
    return this.getQuaternionFromAxis({
      x: this.rotateVectorAroundVector(axis.x, vector, angle),
      y: this.rotateVectorAroundVector(axis.y, vector, angle),
      z: this.rotateVectorAroundVector(axis.z, vector, angle),
    });
  }

  /**
   * @see https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula
   */
  rotateVectorAroundVector(vector: Vector3, axis: Vector3, angle: number): Vector3 {
    // V := vector
    // K := axis
    // a := angle
    // C := cos(a)
    // S := sin(a)
    // result := V.cos(a) + (KxV).sin(a) + K(K.V)(1 - cos(a))
    const unit = this.normalizeVector(axis);
    const C = Math.cos(angle);
    const S = Math.sin(angle);
    const dot = this.dotProduct(vector, unit);
    const cross = this.crossProduct(unit, vector);
    return this.addVectors(
      this.scaleVector(vector, C),
      this.scaleVector(cross, S),
      this.scaleVector(unit, dot * (1 - C))
    );
  }

  dotProduct(vectorA: Vector3, vectorB: Vector3): number {
    const [xa, ya, za] = vectorA;
    const [xb, yb, zb] = vectorB;
    return xa * xb + ya * yb + za * zb;
  }

  crossProduct(vectorA: Vector3, vectorB: Vector3): Vector3 {
    const [xa, ya, za] = vectorA;
    const [xb, yb, zb] = vectorB;
    return [ya * zb - za * yb, za * xb - xa * zb, xa * yb - ya * xb];
  }

  addVectors<T extends Vector>(...vectors: T[]): T {
    const [first, ...rest] = vectors;
    const result: T = [...first];
    for (const vector of rest) {
      for (let index = 0; index < first.length; index += 1) {
        result[index] += vector[index];
      }
    }
    return result;
  }

  subVectors<T extends Vector>(a: T, b: T): T {
    const result: T = [...a];
    for (let index = 0; index < a.length; index += 1) {
      result[index] -= b[index];
    }
    return result;
  }

  scaleVector<T extends Vector>(a: T, scale: number): T {
    return a.map((value) => value * scale) as T;
  }

  normalizeVector<T extends Vector>(vector: T): T {
    const squareLength = vector.reduce((sum, value) => sum + value * value, 0);
    if (squareLength < Calc.EPSILON) return vector;
    if (Math.abs(1 - squareLength) < Calc.EPSILON) return vector;
    const invLength = 1 / Math.sqrt(squareLength);
    return vector.map((value) => value * invLength) as T;
  }

  /**
   * @returns The length of a vector.
   */
  length<T extends Vector>(vector: T): number {
    const squareLength = vector.reduce((sum, value) => sum + value * value, 0);
    return Math.sqrt(squareLength);
  }

  distance<T extends Vector>(pointA: T, pointB: T): number {
    return this.length(this.subVectors(pointB, pointA));
  }

  fitToCover(sourceSize: Size, targetSize: Size, alignement = HALF): SizeAndPos {
    if (sourceSize.width <= 0 || sourceSize.height <= 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    const scaleW = targetSize.width / sourceSize.width;
    const scaleH = targetSize.height / sourceSize.height;
    const scale = Math.max(scaleW, scaleH);
    const coverSize: Size = {
      width: scale * sourceSize.width,
      height: scale * sourceSize.height,
    };
    const overflowX = coverSize.width - targetSize.width;
    const overflowY = coverSize.height - targetSize.height;
    return {
      ...coverSize,
      x: -alignement * overflowX,
      y: -alignement * overflowY,
    };
  }

  /**
   * A plan can be defined by a __point__ and a __direction__.
   * The direction is directed to the hemi-space that must be shown.
   *
   * This representation takes 6 floats.
   * You can also use a normal and a signed distance from the center,
   * which takes only 4 floats. This is how Brayns represent clipping planes.
   */
  plane6to4(
    point: Vector3,
    direction: Vector3
  ): { normal: [number, number, number]; distance: number } {
    const normal = this.normalizeVector(direction);
    const distance = +this.dotProduct(point, normal);
    return { normal, distance };
  }

  areEqualFloats(num1: number, num2: number, epsilon = 1e-6): boolean {
    return Math.abs(num1 - num2) <= epsilon;
  }

  areEqualVectors(vec1: number[], vec2: number[], epsilon = 1e-6): boolean {
    if (vec1.length !== vec2.length) return false;

    for (let i = 0; i < vec1.length; i += 1) {
      const num1 = vec1[i];
      const num2 = vec2[i];
      if (!this.areEqualFloats(num1, num2, epsilon)) return false;
    }
    return true;
  }

  interpolateVectors<T extends number[]>(p0: T, p1: T, t: number): T {
    const w = 1 - t;
    return p0.map((a, i) => {
      const b = p1[i];
      return w * a + t * b;
    }) as T;
  }

  /**
   * Quaternion interpolation.
   */
  slerp(q1: Vector4, q2: Vector4, t: number): Quaternion {
    const q = new ThreeQuaternion(...q1);
    const r = q.slerp(new ThreeQuaternion(...q2), t);

    return [r.x, r.y, r.z, r.w];
  }
}

export function half(value: number): number {
  return value * HALF;
}

export function double(value: number): number {
  return value + value;
}

const calc = new Calc();

export default calc;
