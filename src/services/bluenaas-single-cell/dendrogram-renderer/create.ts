import {
  SphereGeometry,
  MeshLambertMaterial,
  DoubleSide,
  Mesh,
  Vector3,
  BufferGeometry,
  MeshBasicMaterial,
  LineBasicMaterial,
  Line,
  LineDashedMaterial,
} from 'three';
import { getSegmentColor } from '../colors';
import { NeuronSegementInfo } from '../renderer-utils';

export function createSoma(name: string, userData: NeuronSegementInfo | undefined, radius: number) {
  const geometry = new SphereGeometry(radius);
  const material = new MeshLambertMaterial({
    color: getSegmentColor(name),
    side: DoubleSide,
  });
  const mesh = new Mesh(geometry, material);
  if (userData) mesh.userData = userData;
  return mesh;
}

export function createSegment(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: number,
  radius: number
) {
  const dir = vec2(x2, y2).sub(vec2(x1, y1)).normalize().multiplyScalar(radius);
  const side = vec2(dir.y, -dir.x);
  const { x: dx, y: dy } = dir;
  const { x: sx, y: sy } = side;
  const A = vec2(x2, y2);
  const B = vec2(x2 + sx - dx, y2 + sy - dy);
  const C = vec2(x2 - sx - dx, y2 - sx - dy);
  const D = vec2(x1 + sx + dx, y1 + sy + dy);
  const E = vec2(x1 - sx + dx, y1 - sy + dy);
  const F = vec2(x1, y1);
  // prettier-ignore
  const points: Vector3[] = [
    A, B, C,
    B, D, C,
    C, D, E,
    D, F, E,
  ];
  const geometry = new BufferGeometry().setFromPoints(points);
  const material = new MeshBasicMaterial({ color });
  const mesh = new Mesh(geometry, material);
  return mesh;
}

export function createLine(x1: number, y1: number, x2: number, y2: number, color = 0xffffff) {
  const geometry = new BufferGeometry().setFromPoints([
    new Vector3(x1, y1, 0),
    new Vector3(x2, y2, 0),
  ]);
  const material = new LineDashedMaterial({
    color,
    linewidth: 1,
    scale: 1,
    dashSize: 3,
    gapSize: 2,
  });
  return new Line(geometry, material);
}

function vec2(x: number, y: number) {
  return new Vector3(x, y, 0);
}
