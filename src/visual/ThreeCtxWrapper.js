import * as THREE from 'three';
import ThreeContext from './threecontext/ThreeContext';
import MeshCollection from './meshcollection/MeshCollection';

class ThreeCtxWrapper {
  constructor() {
    this.threeContext = null;
    this.meshCollection = null;
  }

  init(div) {
    // this is a way to avoid double renderings (eg. from strict mode on development mode)
    if (div.childNodes.length > 0) {
      this.threeContext.needRender = true;
      return;
    }

    const camPos = new THREE.Vector3(36984.948, 3938.164, 5712.791);
    const camLookat = new THREE.Vector3(6612.504, 3938.164, 5712.791);
    let camUp = null;

    // The option object, you don't have to provide this one
    const options = {
      webgl2: true, // enable WebGL2 if `true` (default: false)
      embedLight: true, // embeds the light into the camera if true (default: false)
      antialias: false, // enables antialias if true (default: true)
      preserveDrawingBuffer: true, // enable if willing to take screenshots
      showAxisHelper: false, // shows the axis helper at (0, 0, 0) when true (default: false)
      axisHelperSize: 100, // length of the the 3 axes of the helper (default: 100)
      controlType: 'orbit', // 'trackball',    // 'orbit': locked poles or 'trackball': free rotations (default: 'trackball')
      cameraPosition: camPos, // inits position of the camera (default: {x: 0, y: 0, z: 100})
      cameraLookAt: camLookat, // inits position to look at (default: {x: 0, y: 0, z: 0})
      raycastOnDoubleClick: true, // performs a raycast when double clicking (default: `true`).
      // If some object from the scene are raycasted, the event 'raycast'
      // is emitted with the list of intersected object from the scene as argument.
    };

    // Instanciating the context
    this.threeContext = new ThreeContext(div, options);

    // CAMERA BUSINESS
    const camera = this.threeContext.getCamera();
    // this is because our unit is micron
    camera.far = 1000000;
    // this is because the Allen orientation is reversed compared to the OpenGL orientation
    if (camUp) {
      camera.up.x = camUp.x;
      camera.up.y = camUp.y;
      camera.up.z = camUp.z;
    } else {
      // camera.up.negate()
      camera.up.set(0, -1, 0);
    }

    camera.updateProjectionMatrix();
    camera.updateMatrix();

    // to be restored later (change of atlas or so)
    this.threeContext.saveCameraSpatialSettings();

    // Optionally, you can show a torus knot, simply to make sure your context is properly setup
    // this._threeContext.addSampleShape()

    this.meshCollection = new MeshCollection(this.threeContext);
  }

  getCtx() {
    return this.threeContext;
  }

  render() {
    this.threeContext.needRender = true;
  }

  getMeshCollection() {
    if (!this.meshCollection) {
      this.meshCollection = new MeshCollection(this.getCtx());
    }
    return this.meshCollection;
  }
}

// we just return an instance
const threeCtxWrapper = new ThreeCtxWrapper();
export default threeCtxWrapper;
