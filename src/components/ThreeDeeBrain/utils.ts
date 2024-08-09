import {
  BufferGeometry as ThreeBufferGeometry,
  Float32BufferAttribute as ThreeFloat32BufferAttribute,
  TextureLoader as ThreeTextureLoader,
  PointsMaterial as ThreePointsMaterial,
  Points as ThreePoints,
  ShaderMaterial,
  Color,
  FrontSide,
  AdditiveBlending,
  Mesh,
} from 'three';
import { BufferAttribute as ThreeBufferAttribute } from 'three/src/core/BufferAttribute';
import { tableFromIPC } from '@apache-arrow/es2015-esm';
import { Color as Threecolor } from 'three/src/math/Color';
import { Point } from '@/components/ThreeDeeBrain/types';
import { basePath } from '@/config';

const parseWFObj = require('wavefront-obj-parser');

const vertexShader = `
    precision highp float;

    uniform float uHalfOpacityDistance;
    varying float intensity;
    uniform bool uFade;

    void main()
    {
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      vec4 worldCoord = modelMatrix * vec4( position, 1.0 );
      vec3 vNormal = normalize( normal );
      vec3 vertexToCameraVec = cameraPosition - vec3(worldCoord);
      vec3 vertexToCameraVecNormalized = normalize( vertexToCameraVec );

      // the raw intensity is good but as we get closer to vertices, the intensity gets higher
      float rawIntensity = 1.0 - abs(dot(vNormal, vertexToCameraVecNormalized));

      // this will help compensate this effect
      vec3 cameraToVertexComponentWise = abs(vertexToCameraVec);
      float cameraToVertexDistance = sqrt( // TODO: optimise by putting that in the if below
        cameraToVertexComponentWise.x * cameraToVertexComponentWise.x +
        cameraToVertexComponentWise.y * cameraToVertexComponentWise.y +
        cameraToVertexComponentWise.z * cameraToVertexComponentWise.z
      );

      // intensity = min(1.0, cameraToVertexDistance / (uHalfOpacityDistance / 2.0)) * rawIntensity;

      // // make sure we dont compute it when too far
      if (uFade && cameraToVertexDistance < 2.0 * uHalfOpacityDistance) {
        // this sigmoid function is tuned to fade the mesh as the camera gets closer.
        // For decay intensity also depends on the radius of the bounding sphere.
        // definition of the function can be found here https://www.desmos.com/calculator/ymodtsbwrp
        float stiffness = 4.0;
        float a = cameraToVertexDistance / stiffness;
        float b = (cameraToVertexDistance - uHalfOpacityDistance) / a;
        float distanceDecay = 0.5 + 0.5 * tanh(b);
        intensity = distanceDecay * rawIntensity;
      } else {
        intensity = rawIntensity;
      }
    }
    `.trim();

const fragmentShader = `
    precision highp float;
    uniform vec3 uColor;
    uniform float uAlpha;

    varying float intensity;

    void main()
    {
      vec3 glow = uColor * intensity;
      gl_FragColor = vec4( glow, intensity * uAlpha);
    }
    `.trim();

function generateGhostMaterial(color: string) {
  return new ShaderMaterial({
    uniforms: {
      // @ts-ignore
      uHalfOpacityDistance: { type: 'f', value: 12000 },
      // @ts-ignore
      uFade: { type: 'bool', value: true },
      // @ts-ignore
      uAlpha: { type: 'f', value: 0.75 },
      // @ts-ignore
      uColor: { type: 'c', value: new Color(color) },
    },
    vertexShader,
    fragmentShader,
    side: FrontSide,
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
}

export const createMesh = (data: string, color: string) => {
  const meshData = parseWFObj(data);
  // the lib leaves room for 4-vertices faces by adding -1
  const indices = new Uint32Array(meshData.vertexPositionIndices.filter((v: number) => v >= 0));
  const positions = new Float32Array(meshData.vertexPositions);
  const geometry = new ThreeBufferGeometry();
  geometry.setIndex(new ThreeBufferAttribute(indices, 1));
  geometry.setAttribute('position', new ThreeBufferAttribute(positions, 3));
  geometry.computeBoundingSphere();
  geometry.computeVertexNormals();
  return new Mesh(geometry, generateGhostMaterial(color));
};

/**
 * Builds the geometry of the point cloud
 * @param points
 */
function buildGeometry(points: Point[]) {
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

export function createPointCloud(arrayBuffer: ArrayBuffer, color: string) {
  const table = tableFromIPC(arrayBuffer);
  const points = table.toArray().map((elem, index) => {
    const dataStr = elem.toString();
    const data = JSON.parse(dataStr);
    const id = index;
    return { id, ...data };
  });
  const sprite = new ThreeTextureLoader().load(`${basePath}/images/disc.png`);
  const material = new ThreePointsMaterial({
    color: new Threecolor(color),
    size: 100,
    map: sprite,
    sizeAttenuation: true,
    alphaTest: 0.5,
    transparent: true,
  });
  const geometry = buildGeometry(points);
  return new ThreePoints(geometry, material);
}
