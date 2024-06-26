import {
  Color as ThreeColor,
  BufferGeometry as ThreeBufferGeometry,
  Float32BufferAttribute as ThreeFloat32BufferAttribute,
  TextureLoader as ThreeTextureLoader,
  PointsMaterial as ThreePointsMaterial,
  Points as ThreePoints,
  MeshBasicMaterial as ThreeMeshBasicMaterial,
  SphereGeometry as ThreeSphereGeometry,
  Group as ThreeGroup,
  Mesh as ThreeMesh,
} from 'three';

import { Point } from '@/components/MeshGenerators/types';
import { basePath } from '@/config';

/**
 * Builds the geometry of the point cloud
 * @param points
 */
export function buildGeometry(points: Point[]) {
  const geometry = new ThreeBufferGeometry();
  const vertices: number[] = [];
  points.forEach((elem) => {
    const { x, y, z } = elem;
    vertices.push(x, y, z);
  });
  geometry.setAttribute('position', new ThreeFloat32BufferAttribute(vertices, 3));
  geometry.computeBoundingSphere();
  return geometry;
}

export function loadNodeSetsAsPoints(points: any[], color: string) {
  const sprite = new ThreeTextureLoader().load(`${basePath}/images/disc.png`);
  const material = new ThreePointsMaterial({
    color: new ThreeColor(color),
    size: 400,
    map: sprite,
    sizeAttenuation: true,
    alphaTest: 0.5,
    transparent: true,
  });
  const geometry = buildGeometry(points);
  return new ThreePoints(geometry, material);
}

function randomlyPickObjects(list: any[], numberOfObjects: number): any[] {
  const stepSize = list.length / numberOfObjects;
  const startIndex = Math.random() * stepSize;

  const selectedObjects = [];
  for (let i = startIndex; i < list.length; i += stepSize) {
    const index = Math.floor(i);
    selectedObjects.push(list[index]);
  }

  return selectedObjects;
}

// This number determines max number of spheres (per target) that will be displayed in the "movie" camera mode
// (orthographic) because we need to render them as actual spheres (and not points).
// This is done for performance reasons and we need to check what number would be best for the typical use case.
const MAX_POINTS_AS_SPHERES = 500;

export function loadNodeSetsAsSpheres(points: any[], color: string) {
  const material = new ThreeMeshBasicMaterial({
    color: new ThreeColor(color),
    alphaTest: 0.5,
    transparent: true,
  });

  const group = new ThreeGroup();

  const pointsBatch = randomlyPickObjects(points, MAX_POINTS_AS_SPHERES);

  pointsBatch.forEach((point) => {
    const sphereGeometry = new ThreeSphereGeometry(40, 6, 6); // Adjust the size of the sphere here
    const sphere = new ThreeMesh(sphereGeometry, material);
    sphere.position.set(point.x, point.y, point.z); // Set the position of the sphere based on the point coordinates
    group.add(sphere);
  });

  return group;
}
