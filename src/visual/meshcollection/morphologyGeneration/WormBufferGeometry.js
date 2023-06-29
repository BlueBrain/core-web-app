// inspired by https://github.com/mrdoob/three.js/blob/master/src/geometries/WormGeometry.js
// but instead of following a path with a fixed sampling and fixed radius, we follow a list
// of positions (Vector3D) and a list of radius.

import {
  BufferGeometry as ThreeBufferGeometry,
  Vector2 as ThreeVector2,
  Vector3 as ThreeVector3,
  Matrix4 as ThreeMatrix4,
  Float32BufferAttribute as ThreeFloat32BufferAttribute,
} from 'three';

export default class WormBufferGeometry extends ThreeBufferGeometry {
  constructor(positions, radii, radialSegments = 32) {
    super();
    this.type = 'WormBufferGeometry';
    const tubularSegments = positions.length - 1;

    const frames = WormBufferGeometry.computeFrenetFrames(positions);
    // expose internals

    this.tangents = frames.tangents;
    this.normals = frames.normals;
    this.binormals = frames.binormals;

    // helper variables
    const vertex = new ThreeVector3();
    const normal = new ThreeVector3();
    const uv = new ThreeVector2();
    let P = new ThreeVector3();

    // buffer
    const vertices = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    // functions
    function generateSegment(i) {
      // we use getPointAt to sample evenly distributed points from the given path

      // P = path.getPointAt( i / tubularSegments, P );
      P = positions[i];

      // retrieve corresponding normal and binormal
      const N = frames.normals[i];
      const B = frames.binormals[i];

      // generate normals and vertices for the current segment
      for (let j = 0; j <= radialSegments; j += 1) {
        const v = (j / radialSegments) * Math.PI * 2;
        const sin = Math.sin(v);
        const cos = -Math.cos(v);

        // normal
        normal.x = cos * N.x + sin * B.x;
        normal.y = cos * N.y + sin * B.y;
        normal.z = cos * N.z + sin * B.z;
        normal.normalize();

        normals.push(normal.x, normal.y, normal.z);

        // vertex
        vertex.x = P.x + radii[i] * normal.x;
        vertex.y = P.y + radii[i] * normal.y;
        vertex.z = P.z + radii[i] * normal.z;
        vertices.push(vertex.x, vertex.y, vertex.z);
      }
    }

    function generateIndices() {
      for (let j = 1; j <= tubularSegments; j += 1) {
        for (let i = 1; i <= radialSegments; i += 1) {
          const a = (radialSegments + 1) * (j - 1) + (i - 1);
          const b = (radialSegments + 1) * j + (i - 1);
          const c = (radialSegments + 1) * j + i;
          const d = (radialSegments + 1) * (j - 1) + i;

          // faces
          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }
    }

    function generateUVs() {
      for (let i = 0; i <= tubularSegments; i += 1) {
        for (let j = 0; j <= radialSegments; j += 1) {
          uv.x = i / tubularSegments;
          uv.y = j / radialSegments;
          uvs.push(uv.x, uv.y);
        }
      }
    }

    function generateBufferData() {
      for (let i = 0; i < positions.length; i += 1) {
        generateSegment(i);
      }

      // uvs are generated in a separate function.
      // this makes it easy compute correct values for closed geometries
      generateUVs();

      // finally create faces
      generateIndices();
    }

    generateBufferData();

    // build geometry
    this.setIndex(indices);
    // this.addAttribute('position', new ThreeFloat32BufferAttribute(vertices, 3))
    // this.addAttribute('normal', new ThreeFloat32BufferAttribute(normals, 3))
    // this.addAttribute('uv', new ThreeFloat32BufferAttribute(uvs, 2))
    this.setAttribute('position', new ThreeFloat32BufferAttribute(vertices, 3));
    this.setAttribute('normal', new ThreeFloat32BufferAttribute(normals, 3));
    this.setAttribute('uv', new ThreeFloat32BufferAttribute(uvs, 2));
  } // end constructor

  static computeFrenetFrames(positions) {
    const normals = [new ThreeVector3()];
    const binormals = [new ThreeVector3()];

    const tangents = positions.map((pos, i) => {
      // general cases
      let p1i = i - 1;
      let p2i = i + 1;

      // exceptions on both ends
      if (i === 0) {
        // at start
        p1i = 0;
      } else if (i === positions.length - 1) {
        // at end
        p2i = positions.length - 1;
      }

      const p1 = positions[p1i];
      const p2 = positions[p2i];
      const tangent = new ThreeVector3();
      tangent.copy(p2).sub(p1).normalize();
      return tangent;
    });

    // some temporary data holders
    const normal = new ThreeVector3();
    const vec = new ThreeVector3();
    const mat = new ThreeMatrix4();

    // the first point has a special treatment
    let min = Number.MAX_VALUE;
    const tx = Math.abs(tangents[0].x);
    const ty = Math.abs(tangents[0].y);
    const tz = Math.abs(tangents[0].z);

    if (tx <= min) {
      min = tx;
      normal.set(1, 0, 0);
    }

    if (ty <= min) {
      min = ty;
      normal.set(0, 1, 0);
    }

    if (tz <= min) {
      normal.set(0, 0, 1);
    }

    vec.crossVectors(tangents[0], normal).normalize();
    normals[0].crossVectors(tangents[0], vec);
    binormals[0].crossVectors(tangents[0], normals[0]);

    // Then compute for the other points
    for (let i = 1; i < positions.length; i += 1) {
      normals[i] = normals[i - 1].clone();
      binormals[i] = binormals[i - 1].clone();
      vec.crossVectors(tangents[i - 1], tangents[i]);

      if (vec.length() > Number.EPSILON) {
        vec.normalize();
        const theta = Math.acos(Math.max(-1, Math.min(1, tangents[i - 1].dot(tangents[i]))));
        normals[i].applyMatrix4(mat.makeRotationAxis(vec, theta));
      }
      binormals[i].crossVectors(tangents[i], normals[i]);
    }

    return {
      tangents,
      normals,
      binormals,
    };
  }
}

export { WormBufferGeometry };
