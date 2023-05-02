import * as THREE from 'three';
import threeCtxWrapper from '@/visual/ThreeCtxWrapper';

const USE_MATERIAL_CASE = {
  GHOST: 1,
  SOLID: 2,
  NORMAL: 3,
  WIREFRAME: 4,
};

export { USE_MATERIAL_CASE };

export default class AtlasMesh extends THREE.Object3D {
  static generateGhostMateral(options = {}) {
    const halfOpacityDistance =
      'halfOpacityDistance' in options ? options.halfOpacityDistance : 12000;
    const fade = 'fade' in options ? options.fade : true;
    const alpha = 'alpha' in options ? options.alpha : 0.75;
    const color = 'color' in options ? new THREE.Color(options.color) : new THREE.Color('#FFFFFF');

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

    const ghostMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uHalfOpacityDistance: { type: 'f', value: halfOpacityDistance },
        uFade: { value: fade },
        uAlpha: { type: 'f', value: alpha },
        uColor: { type: 'c', value: color },
      },
      vertexShader,
      fragmentShader,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true,

      // depthTest: false,
      depthWrite: false,
    });

    return ghostMaterial;
  }

  /**
   *
   * @param {string} name - the name to give to this Object3D
   * @param {Float32Array} positions - the positions as [x, y, z, ...]
   * @param {Object} options - the option object
   * @param {}
   */
  constructor(geometry, options = {}) {
    super();
    this.name = 'name' in options ? options.name : '';
    this.geometry = geometry;
    this.color = 'color' in options ? options.color : '#ffffff';
    this.alpha = 'alpha' in options ? options.alpha : 0.75;

    if (!geometry.boundingSphere) {
      geometry.computeBoundingSphere();
    }

    this.halfOpacityDistance =
      'halfOpacityDistance' in options
        ? options.halfOpacityDistance
        : geometry.boundingSphere.radius * 1.5;
    this.fade = 'fade' in options ? options.fade : true;
    this.useMaterialCase = USE_MATERIAL_CASE.GHOST;

    this.solidMaterial = new THREE.MeshPhongMaterial({
      color: this.color,
    });

    this.normalMaterial = new THREE.MeshNormalMaterial();
    this.wireframeMaterial = new THREE.MeshBasicMaterial({
      color: this.color,
      wireframe: true,
    });

    this.ghostMaterial = AtlasMesh.generateGhostMateral({
      color: this.color,
      halfOpacityDistance: this.halfOpacityDistance,
      fade: this.fade,
      alpha: this.alpha,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.ghostMaterial);

    if (options.makeVisible === false) {
      this.mesh.visible = false;
    }

    this.add(this.mesh);
    threeCtxWrapper.render();
    Object.setPrototypeOf(this, AtlasMesh.prototype);
  }

  get boundingSphere() {
    return this.geometry.boundingSphere;
  }

  getColor() {
    return this.color;
  }

  setColor(c) {
    this.color = c;
    const rgbColor = new THREE.Color(this.color);
    this.solidMaterial.color = rgbColor;
    this.wireframeMaterial.color = rgbColor;
    this.ghostMaterial.uniforms.uColor = { value: rgbColor };
    threeCtxWrapper.render();
  }

  setAlpha(a) {
    this.alpha = a;
    this.ghostMaterial.uniforms.uAlpha = { value: a };
    threeCtxWrapper.render();
  }

  getAlpha() {
    return this.alpha;
  }

  getUseMaterialCase() {
    return this.useMaterialCase;
  }

  setUseMaterialCase(matCase) {
    let matToUse = null;

    switch (matCase) {
      case USE_MATERIAL_CASE.GHOST:
        matToUse = this.ghostMaterial;
        this.useMaterialCase = USE_MATERIAL_CASE.GHOST;
        break;

      case USE_MATERIAL_CASE.SOLID:
        matToUse = this.solidMaterial;
        this.useMaterialCase = USE_MATERIAL_CASE.SOLID;
        break;

      case USE_MATERIAL_CASE.NORMAL:
        matToUse = this.normalMaterial;
        this.useMaterialCase = USE_MATERIAL_CASE.NORMAL;
        break;

      case USE_MATERIAL_CASE.WIREFRAME:
        matToUse = this.wireframeMaterial;
        this.useMaterialCase = USE_MATERIAL_CASE.WIREFRAME;
        break;

      default:
    }

    if (!matToUse) {
      return;
    }

    this.mesh.material = matToUse;
    threeCtxWrapper.render();
  }

  enableFading() {
    this.fade = true;
    this.ghostMaterial.uniforms.uFade.value = this.fade;
    threeCtxWrapper.render();
  }

  disableFading() {
    this.fade = false;
    this.ghostMaterial.uniforms.uFade.value = this.fade;
    threeCtxWrapper.render();
  }

  getFading() {
    return this.fade;
  }
}
