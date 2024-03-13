import {
  CylinderGeometry,
  DoubleSide,
  Material,
  Mesh,
  MeshLambertMaterial,
  Quaternion,
  Vector3,
} from 'three';

export function createSegmentMesh(sec: any, segIdx: number, openEnded: boolean, color: number) {
  const v = new Vector3(sec.xcenter[segIdx], sec.ycenter[segIdx], sec.zcenter[segIdx]);

  const axis = new Vector3(sec.xdirection[segIdx], sec.ydirection[segIdx], sec.zdirection[segIdx]);
  axis.normalize();

  const rotQuat = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), axis);

  const length = sec.length[segIdx];
  const distance = sec.distance[segIdx];
  const scaleLength = distance / length;

  const geometry = new CylinderGeometry(
    sec.diam[segIdx] / 2,
    sec.diam[segIdx] / 2,
    length,
    12,
    1,
    openEnded
  );
  const material = new MeshLambertMaterial({ color, side: DoubleSide });

  const mesh = new Mesh(geometry, material);

  mesh.scale.setY(scaleLength);
  mesh.setRotationFromQuaternion(rotQuat);
  mesh.position.copy(v);

  return mesh;
}

export function createSegMarkerMesh(sec: any, segIdx: number, material: Material) {
  const v = new Vector3(sec.xcenter[segIdx], sec.ycenter[segIdx], sec.zcenter[segIdx]);

  const axis = new Vector3(sec.xdirection[segIdx], sec.ydirection[segIdx], sec.zdirection[segIdx]);
  axis.normalize();

  const rotQuat = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), axis);

  const length = sec.length[segIdx];
  const distance = sec.distance[segIdx];
  const scaleLength = distance / length;

  const d = sec.diam[segIdx] / 2;

  const dDelta = 3 / Math.ceil(Math.sqrt(d));
  const markerD = d * 1.2 + dDelta;

  const geometry = new CylinderGeometry(markerD, markerD, length, 12, 1, true);

  const mesh = new Mesh(geometry, material.clone());

  mesh.scale.setY(scaleLength);
  mesh.setRotationFromQuaternion(rotQuat);
  mesh.position.copy(v);

  mesh.updateMatrix();
  mesh.matrixAutoUpdate = false;

  return mesh;
}
