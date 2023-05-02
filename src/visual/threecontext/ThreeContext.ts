import * as THREE from 'three';
import OrbitControls from './thirdparty/OrbitControls';

type ControlType = 'orbit' | 'trackball';

interface CameraSpatialSettings {
  lookat: THREE.Vector3;
  up: THREE.Vector3;
  position: THREE.Vector3;
}

export interface ThreeContextOptions {
  webgl2: boolean; // enable WebGL2 if `true` (default: false)
  embedLight: boolean; // embeds the light into the camera if true (default: false)
  antialias: boolean; // enables antialias if true (default: true)
  preserveDrawingBuffer: boolean; // enable if willing to take screenshots
  showAxisHelper: boolean; // shows the axis helper at (0, 0, 0) when true (default: false)
  axisHelperSize: number; // length of the 3 axes of the helper (default: 100)
  controlType: ControlType; // 'trackball',    // 'orbit': locked poles or 'trackball': free rotations (default: 'trackball')
  cameraPosition: THREE.Vector3;
  cameraLookAt: THREE.Vector3;
  raycastOnDoubleClick: boolean; // performs a raycast when double-clicking (default: `true`).
}

/**
 * ThreeContext creates a WebGL context using Threejs. It also handle mouse control with two possible logics
 * (orbit or trackball)
 * An event can be associated to a ThreeContext instance: `raycast` with the method
 * `.on("raycast", function(hits){...})` where `hits` is the object list being raycasted.
 */
class ThreeContext {
  needRender: boolean;

  private requestFrameId: number | null;

  public readonly scene: THREE.Scene;

  private readonly camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;

  private renderer: THREE.WebGLRenderer;

  private readonly raycaster: THREE.Raycaster;

  private readonly raycastMouse: THREE.Vector2;

  private defaultRaycastParent: THREE.Scene | THREE.Object3D;

  private controls: OrbitControls;

  private cameraSpatialSettings: CameraSpatialSettings;

  private readonly ambientLight: THREE.AmbientLight;

  private readonly axesHelper: THREE.AxesHelper;

  constructor(div: HTMLDivElement, options: ThreeContextOptions) {
    if (!div) {
      throw new Error('The ThreeContext needs a div object');
    }

    this.needRender = true;

    // perform some refresh every half second in case the needRender was forgotten tp toggle
    setInterval(() => {
      this.needRender = true;
    }, 500);

    this.requestFrameId = null;

    // init scene
    this.scene = new THREE.Scene();

    // init camera
    this.camera = new THREE.PerspectiveCamera(27, div.clientWidth / div.clientHeight, 1, 50000);
    const cameraPosition: [number, number, number] =
      'cameraPosition' in options
        ? (options.cameraPosition.clone().toArray() as [number, number, number])
        : [0, 0, 0];
    this.camera.position.set(...cameraPosition);

    this.scene.add(this.camera);
    this.camera.updateMatrix();
    this.cameraSpatialSettings = {
      lookat: new THREE.Vector3(0, 0, 0),
      up: new THREE.Vector3(0, 0, 0),
      position: new THREE.Vector3(0, 0, 0),
    };

    // adding some light
    this.ambientLight = new THREE.AmbientLight(0x444444);
    this.scene.add(this.ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    if (options.embedLight) {
      this.camera.add(pointLight);
    } else {
      this.scene.add(pointLight);
    }

    // add some axis helper
    this.axesHelper = new THREE.AxesHelper(
      'axisHelperSize' in options ? options.axisHelperSize : 100
    );
    if (options.showAxisHelper) {
      this.scene.add(this.axesHelper);
    }

    // init the renderer
    // this.renderer = null;
    if ('webgl2' in options ? options.webgl2 : true) {
      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'width:100%;';
      div.appendChild(canvas);
      const context = canvas.getContext('webgl2', {
        preserveDrawingBuffer:
          'preserveDrawingBuffer' in options ? options.preserveDrawingBuffer : false,
        alpha: true,
        antialias: 'antialias' in options ? options.antialias : true,
      }) as WebGL2RenderingContext;

      this.renderer = new THREE.WebGLRenderer({
        canvas,
        context,
      });
    } else {
      this.renderer = new THREE.WebGLRenderer({
        antialias: 'antialias' in options ? options.antialias : true,
        alpha: true,
        preserveDrawingBuffer: true,
      });
    }

    this.renderer.setClearColor(0xffffff, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(div.clientWidth, div.clientHeight);
    div.appendChild(this.renderer.domElement);

    // all the necessary for raycasting
    this.raycaster = new THREE.Raycaster();
    if (this.raycaster.params.Points) {
      this.raycaster.params.Points.threshold = 50; // distance in micron
    }
    if (this.raycaster.params.Line) this.raycaster.params.Line.threshold = 50; // distance in micron
    this.raycastMouse = new THREE.Vector2();

    let windowRect = this.renderer.domElement.getBoundingClientRect();

    // improve this
    this.renderer.domElement.addEventListener(
      'mousemove',
      (event) => {
        const relX = event.clientX - windowRect.left;
        const relY = event.clientY - windowRect.top;
        this.raycastMouse.x = (relX / this.renderer.domElement.clientWidth) * 2 - 1;
        this.raycastMouse.y = -(relY / this.renderer.domElement.clientHeight) * 2 + 1;
      },
      false
    );

    // when the 3D container resizes, calls the resize function to re-calculate the width
    const resizeObserver = new ResizeObserver(() => {
      this.resize();
    });

    resizeObserver.observe(this.renderer.domElement.parentElement as HTMLElement);

    this.defaultRaycastParent = this.scene;

    // todo this is probably to be removed
    if ('raycastOnDoubleClick' in options ? options.raycastOnDoubleClick : false) {
      /* empty */
    }

    // mouse controls
    const controlType = 'controlType' in options ? options.controlType : 'orbit';

    if (controlType === 'orbit') {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.rotateSpeed *= -1;
    } else {
      throw new Error('Invalid ControlType provided');
    }

    const cameraLookAt =
      'cameraLookAt' in options ? options.cameraLookAt : new THREE.Vector3(0, 0, 0);
    this.lookAt(cameraLookAt);

    window.addEventListener(
      'resize',
      () => {
        windowRect = this.renderer.domElement.getBoundingClientRect();

        // @ts-ignore
        this.camera.aspect = div.clientWidth / div.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(div.clientWidth, div.clientHeight);

        // this actually applies only to trackball control
        try {
          // @ts-ignore
          this.controls.handleResize();
        } catch (e) {
          /* empty */
        }
      },
      false
    );

    // @ts-ignore
    this.controls.addEventListener('change', () => {
      this.needRender = true;
    });

    this._animate();
  }

  setDefaultRaycastParent(obj: THREE.Scene | THREE.Object3D) {
    this.defaultRaycastParent = obj;
  }

  /**
   * Resize the 3d render container to match a given width
   * @param width the width to match
   */
  resize() {
    const canvas = this.renderer.domElement;
    const width = canvas.parentElement?.clientWidth ?? 600;
    const height = canvas.parentElement?.clientHeight ?? 600;
    // look up the size the canvas is being displayed
    this.renderer.setSize(width, height, true);
    if (this.camera.type === 'PerspectiveCamera') {
      const cam = this.camera as THREE.PerspectiveCamera;
      cam.aspect = width / height;
    }
    this.camera.updateProjectionMatrix();
  }

  saveCameraSpatialSettings() {
    this.cameraSpatialSettings.position = this.camera.position.clone();
    this.cameraSpatialSettings.up = this.camera.up.clone();
    this.cameraSpatialSettings.lookat = this.getLookAt().clone();
    // this._cameraSpatialSettings.rotation = this._camera.rotation.clone()
    // this._cameraSpatialSettings.quaternion = this._camera.quaternion.clone()
  }

  resetCameraSpatialSettings() {
    this.needRender = true;
    this.camera.position.copy(this.cameraSpatialSettings.position);
    this.camera.up.copy(this.cameraSpatialSettings.up);
    this.lookAt(this.cameraSpatialSettings.lookat);
  }

  /**
   * Get the default AmbientLight
   * @return {THREE.AmbientLight}
   */
  getAmbientLight() {
    return this.ambientLight;
  }

  /**
   * Get the axes helper
   * @return {THREE.Mesh}
   */
  getAxesHelper() {
    return this.axesHelper;
  }

  /**
   * Get the scene, mainly so that we can externalize things from this file
   * @return {THREE.Scene}
   */
  getScene() {
    return this.scene;
  }

  /**
   * Get the camera
   * @return {THREE.Camera}
   */
  getCamera() {
    return this.camera;
  }

  /**
   * Since we are using Controls, applying the lookat just on the camera in not enough
   * @param {THREE.Vector3} pos - a position to look at
   */
  lookAt(pos: THREE.Vector3) {
    this.needRender = true;
    this.controls.target.set(pos.x, pos.y, pos.z);
  }

  getLookAt() {
    return this.controls.target.clone();
  }

  lookAtXYZ(x: number, y: number, z: number) {
    this.needRender = true;
    this.controls.target.set(x, y, z);
  }

  /**
   * Get the field of view angle of the camera, in degrees
   * @return {Number}
   */
  getCameraFieldOfView() {
    return this.camera.type === 'PerspectiveCamera'
      ? (this.camera as THREE.PerspectiveCamera).fov
      : null;
  }

  /**
   * Define the camera field of view, in degrees
   * @param {Number} fov - the fov
   */
  setCameraFieldOfView(fov: number) {
    if (this.camera.type === 'PerspectiveCamera') {
      this.needRender = true;
      const cam = this.camera as THREE.PerspectiveCamera;
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  }

  /**
   * @private
   * deals with rendering and updating the controls
   */
  _animate = () => {
    this.requestFrameId = requestAnimationFrame(this._animate);
    this.controls?.update();

    if (this.needRender) {
      this.renderer?.render(this.scene, this.camera);
      this.needRender = false;
    }
  };

  /**
   * Get the png image data as base64, in order to later display it in a <img> markup
   */
  getScreenshot() {
    const strMime = 'image/png';
    return this.renderer?.domElement.toDataURL(strMime);
  }

  setCameraPosition(newPosition: [number, number, number]) {
    this.needRender = true;
    this.camera.position.set(...newPosition);
  }

  switchToOrthographicCamera() {
    const cam = this.camera as { type: string };
    cam.type = 'OrthographicCamera';
  }

  switchToPerspectiveCamera() {
    const cam = this.camera as { type: string };
    cam.type = 'PerspectiveCamera';
  }
}

export default ThreeContext;
