/*
 * @author Mugen87 / https://github.com/Mugen87
 */

import * as THREE from 'three';
import QuickHull from './QuickHull';

// ConvexGeometry

function ConvexGeometry(points) {
  THREE.Geometry.call(this);

  this.fromBufferGeometry(new ConvexBufferGeometry(points));
  this.mergeVertices();
}

ConvexGeometry.prototype = Object.create(THREE.Geometry.prototype);
ConvexGeometry.prototype.constructor = ConvexGeometry;

// ConvexBufferGeometry

function ConvexBufferGeometry(points) {
  THREE.BufferGeometry.call(this);

  // buffers

  const vertices = [];
  const normals = [];

  // execute QuickHull

  if (QuickHull === undefined) {
    console.error('THREE.ConvexBufferGeometry: ConvexBufferGeometry relies on THREE.QuickHull');
  }

  const quickHull = new QuickHull().setFromPoints(points);

  // generate vertices and normals

  const { faces } = quickHull;

  for (let i = 0; i < faces.length; i++) {
    const face = faces[i];
    let { edge } = face;

    // we move along a doubly-connected edge list to access all face points (see HalfEdge docs)

    do {
      const { point } = edge.head();

      vertices.push(point.x, point.y, point.z);
      normals.push(face.normal.x, face.normal.y, face.normal.z);

      edge = edge.next;
    } while (edge !== face.edge);
  }

  // build geometry

  this.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  this.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
}

ConvexBufferGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
ConvexBufferGeometry.prototype.constructor = ConvexBufferGeometry;

// export
/*
export default ({
  ConvexGeometry,
  ConvexBufferGeometry,
})
*/

export { ConvexGeometry, ConvexBufferGeometry };
