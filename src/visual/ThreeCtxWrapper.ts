import * as THREE from 'three';
import ThreeContext from './threecontext/ThreeContext';
import MeshCollection from './meshcollection/MeshCollection';
import OrbitControls from '@/visual/threecontext/thirdparty/OrbitControls';

interface ThreeCtxWrapperInitParams {
  targetDiv: HTMLDivElement;
  cameraPositionXYZ?: [number, number, number];
  cameraLookAtXYZ?: [number, number, number];
}

class ThreeCtxWrapper {
  threeContext: ThreeContext | null = null;

  meshCollection: MeshCollection | null = null;

  init({
    targetDiv,
    cameraPositionXYZ = [37984.948, 3938.164, 5712.791],
    cameraLookAtXYZ = [6612.504, 3938.164, 5712.791],
  }: ThreeCtxWrapperInitParams) {
    // this is a way to avoid double renderings (e.g. from strict mode on development mode)
    if (targetDiv.childNodes.length > 0 && this.threeContext) {
      this.threeContext.needRender = true;
      return;
    }

    // The option object, you don't have to provide this one
    const options = {
      webgl2: true, // enable WebGL2 if `true` (default: false)
      embedLight: true, // embeds the light into the camera if true (default: false)
      antialias: false, // enables antialias if true (default: true)
      preserveDrawingBuffer: true, // enable if willing to take screenshots
      showAxisHelper: false, // shows the axis helper at (0, 0, 0) when true (default: false)
      axisHelperSize: 100, // length of the 3 axes of the helper (default: 100)
      controlType: 'orbit', // 'trackball',    // 'orbit': locked poles or 'trackball': free rotations (default: 'trackball')
      cameraPosition: new THREE.Vector3(...cameraPositionXYZ),
      cameraLookAt: new THREE.Vector3(...cameraLookAtXYZ),
      raycastOnDoubleClick: true, // performs a raycast when double-clicking (default: `true`).
      // If some object from the scene are raycasted, the event 'raycast'
      // is emitted with the list of intersected object from the scene as argument.
    };

    // Instantiating the context
    this.threeContext = new ThreeContext(targetDiv, options);

    // CAMERA BUSINESS
    const camera: THREE.Camera = this.threeContext.getCamera();
    // this is because our unit is micron
    (camera as THREE.PerspectiveCamera).far = 1000000;
    camera.up.set(0, -1, 0);

    // @ts-ignore
    camera.updateProjectionMatrix();
    camera.updateMatrix();

    // to be restored later (change of atlas or so)
    this.threeContext.saveCameraSpatialSettings();

    // Optionally, you can show a torus knot, simply to make sure your context is properly setup
    // this._threeContext.addSampleShape()
    // @ts-ignore
    this.meshCollection = new MeshCollection(this.threeContext);
  }

  getCtx() {
    return this.threeContext;
  }

  render() {
    if (this.threeContext) {
      this.threeContext.needRender = true;
    }
  }

  getMeshCollection() {
    if (!this.meshCollection) {
      // @ts-ignore
      this.meshCollection = new MeshCollection(this.getCtx());
    }
    return this.meshCollection;
  }
}

// we just return an instance
const threeCtxWrapper = new ThreeCtxWrapper();
export default threeCtxWrapper;
