import * as THREE from 'three';
import threeCtxWrapper from '../ThreeCtxWrapper';

const USE_COLOR_CASE = {
  SOLID: 1,
  REGION: 2,
  CELL_TYPE: 3,
};

export { USE_COLOR_CASE };

export default class PointCloudMesh extends THREE.Object3D {
  static generatePointCloudMaterial(options = {}) {
    const solidColor = 'solidColor' in options ? options.solidColor : '#FFFFFF';
    const useColorCase = 'useColorCase' in options ? options.useColorCase : USE_COLOR_CASE.REGION;
    const pointRadius = 'pointRadius' in options ? options.pointRadius : 200;
    const blending = 'blending' in options ? options.blending : 'NoBlending';
    const alpha = 'alpha' in options ? options.alpha : 1.0;

    const shader = {
      vertex: `
      uniform float uPointRadius;
      uniform vec3 uSolidColor;
      attribute vec3 pointRegionColor;
      attribute vec3 pointCellTypeColor;
      varying vec3 vPointRegionColor;
      varying vec3 vPointCellTypeColor;

      float epsilon = 0.001;

      bool isEqualFloat(in float a, in float b){
        return (abs(a - b) <  epsilon);
      }

      void main() {
        vPointRegionColor = pointRegionColor;
        vPointCellTypeColor = pointCellTypeColor;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = uPointRadius * ( 150.0 / -mvPosition.z );
        // gl_PointSize = uPointRadius; // constant screen-size
        gl_Position = projectionMatrix * mvPosition;
      }`,

      fragment: `
      uniform float uAlpha;
      uniform vec3 uSolidColor;
      uniform int uUseColorCase;
      varying vec3 vPointRegionColor;
      varying vec3 vPointCellTypeColor;

      void main() {
        vec2 uv = vec2( gl_PointCoord.x -0.5, 1.0 - gl_PointCoord.y-0.5 );
        float dFromCenter = sqrt(uv.x*uv.x + uv.y*uv.y);

        if(dFromCenter > 0.5){
          discard;
          return;
        }

        vec3 col = uSolidColor;

        if (uUseColorCase == ${USE_COLOR_CASE.REGION}) {
          col = vPointRegionColor;
        } else if (uUseColorCase == ${USE_COLOR_CASE.CELL_TYPE}) {
          col = vPointCellTypeColor;
        }

        gl_FragColor = vec4(col, uAlpha);
      }`,
    };

    const uniforms = {
      uPointRadius: { value: pointRadius },
      uAlpha: { value: alpha, type: 'f' },
      uSolidColor: { type: 'c', value: solidColor },
      uUseColorCase: { value: useColorCase },
    };

    // material
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: shader.vertex,
      fragmentShader: shader.fragment,
      transparent: alpha < 0.99,
      blending: THREE[blending], // THREE.NoBlending ,//AdditiveBlending,
      // depthTest: false, // default: true
    });

    return material;
  }

  /**
   *
   * @param {string} name - the name to give to this Object3D
   * @param {Float32Array} positions - the positions as [x, y, z, ...]
   * @param {Object} options - the option object
   * @param {}
   */
  constructor(name, positions, pointRegionColor, pointCellTypeColor) {
    super();
    this.name = name;
    this.solidColor = '#FFFFFF';
    this.pointRegionColor = pointRegionColor;
    this.pointCellTypeColor = pointCellTypeColor;
    this.useColorCase = USE_COLOR_CASE.REGION;
    this.pointRadius = 200;
    this.vectorLength = 200;

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute(
      'pointRegionColor',
      new THREE.BufferAttribute(this.pointRegionColor, 3)
    );
    this.geometry.setAttribute(
      'pointCellTypeColor',
      new THREE.BufferAttribute(this.pointCellTypeColor, 3)
    );
    this.geometry.computeBoundingSphere();
    this.geometry.computeBoundingBox();

    this.material = PointCloudMesh.generatePointCloudMaterial({
      solidColor: new THREE.Color(this.solidColor),
      pointRadius: this.pointRadius,
      useColorCase: this.useColorCase,
    });

    this.mesh = new THREE.Points(this.geometry, this.material);
    this.add(this.mesh);
    threeCtxWrapper.render();
    Object.setPrototypeOf(this, PointCloudMesh.prototype);
  }

  get boundingSphere() {
    return this.geometry.boundingSphere;
  }

  getSolidColor() {
    return this.solidColor;
  }

  setSolidColor(c) {
    this.solidColor = c;
    this.material.uniforms.uSolidColor = {
      value: new THREE.Color(this.solidColor),
    };
    threeCtxWrapper.render();
  }

  getUseColorCase() {
    return this.useColorCase;
  }

  setUseColorCase(u) {
    this.useColorCase = u;
    this.material.uniforms.uUseColorCase = { value: this.useColorCase };
    threeCtxWrapper.render();
  }

  getPointRadius() {
    return this.pointRadius;
  }

  setPointRadius(r) {
    this.pointRadius = r;
    this.material.uniforms.uPointRadius = { value: this.pointRadius };
    threeCtxWrapper.render();
  }

  getVectorLength() {
    return this.vectorLength;
  }

  setVectorLength(v) {
    this.vectorLength = v;
    threeCtxWrapper.render();
  }
}
