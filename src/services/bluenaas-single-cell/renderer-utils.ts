import {
  CylinderGeometry,
  DoubleSide,
  Material,
  Mesh,
  MeshLambertMaterial,
  Quaternion,
  Vector3,
  SphereGeometry,
  MeshPhongMaterial,
  ColorRepresentation,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Color,
  ShaderMaterial,
} from 'three';
import { MorphSection } from './types';

export function createSegmentMesh(
  sec: MorphSection,
  segIdx: number,
  openEnded: boolean,
  color: number
) {
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
  mesh.userData = {
    segIdx,
    sectionName: sec.name,
  };
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

export function createBubble(position: Vector3, color: ColorRepresentation = 0xffffff) {
  // Create a sphere geometry
  const geometry = new SphereGeometry(1, 8, 8); // Radius, widthSegments, heightSegments

  // Create a material with transparent and reflective properties
  const material = new MeshPhongMaterial({
    color,
    transparent: true,
    opacity: 1,
    shininess: 100,
  });

  const bubble = new Mesh(geometry, material);
  bubble.position.copy(position);
  return bubble;
}

export function createBubblesInstanced(
  positions: [number, number, number][],
  color: ColorRepresentation | undefined = 0xfffff
) {
  const colors = positions.flatMap(() => new Color(color).toArray());

  const sphereGeometry = new SphereGeometry(0.8, 12, 12);
  const instancedGeometry = new InstancedBufferGeometry();

  // Copy the sphere geometry into the instanced geometry
  instancedGeometry.index = sphereGeometry.index;
  instancedGeometry.attributes.uv = sphereGeometry.attributes.uv;
  instancedGeometry.attributes.normal = sphereGeometry.attributes.normal;
  instancedGeometry.attributes.position = sphereGeometry.attributes.position;
  instancedGeometry.setAttribute(
    'sphereInstancePosition',
    new InstancedBufferAttribute(new Float32Array(positions.flat()), 3)
  );
  instancedGeometry.setAttribute(
    'sphereInstanceColor',
    new InstancedBufferAttribute(new Float32Array(colors), 3)
  );

  // Create a material that supports instancing
  const material = new ShaderMaterial({
    uniforms: {
      color: { value: color },
    },
    vertexShader: `
      attribute vec3 sphereInstancePosition;
      attribute vec3 sphereInstanceColor;
      varying vec3 vColor;
      void main() {
        vColor = sphereInstanceColor;
        vec3 transformed = position + sphereInstancePosition;
        vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        gl_FragColor = vec4(vColor, 1.0);
      }
    `,
  });

  const instancedMesh = new Mesh(instancedGeometry, material);

  return instancedMesh;
}
