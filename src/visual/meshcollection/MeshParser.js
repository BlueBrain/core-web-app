import * as THREE from 'three';
import parseWFObj from 'wavefront-obj-parser';
import constants from '../constants';

const MESH_FORMAT_LOOKUP = {
  [constants.OBJ_MIME]: 'parseObj',
};

class MeshParser {
  static getCompatibleFormats() {
    return Object.keys(MESH_FORMAT_LOOKUP);
  }

  static parseObj(data) {
    const meshData = parseWFObj(data);
    const indices = new Uint32Array(meshData.vertexPositionIndices.filter((v) => v >= 0)); // the lib leaves room for 4-vertices faces by adding -1
    const positions = new Float32Array(meshData.vertexPositions);
    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.computeBoundingSphere();
    geometry.computeVertexNormals();

    return geometry;
  }

  static parseFromData(data, format) {
    return MeshParser[MESH_FORMAT_LOOKUP[format]](data);
  }
}

export default MeshParser;
