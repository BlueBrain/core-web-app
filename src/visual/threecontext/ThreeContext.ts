import {
  Vector2 as ThreeVector2,
  Vector3 as ThreeVector3,
  Scene as ThreeScene,
  WebGLRenderer as ThreeWebGLRenderer,
  Raycaster as ThreeRaycaster,
  Camera as ThreeCamera,
  PerspectiveCamera as ThreePerspectiveCamera,
  OrthographicCamera as ThreeOrthographicCamera,
  Event as ThreeEvent,
  AxesHelper as ThreeAxesHelper,
  Object3D as ThreeObject3D,
} from 'three';

import OrbitControls from './thirdparty/OrbitControls';

type ControlType = 'orbit' | 'trackball';

export interface ThreeContextOptions {
  webgl2: boolean; // enable WebGL2 if `true` (default: false)
  embedLight: boolean; // embeds the light into the camera if true (default: false)
  antialias: boolean; // enables antialias if true (default: true)
  preserveDrawingBuffer: boolean; // enable if willing to take screenshots
  showAxisHelper: boolean; // shows the axis helper at (0, 0, 0) when true (default: false)
  axisHelperSize: number; // length of the 3 axes of the helper (default: 100)
  controlType: ControlType; // 'trackball',    // 'orbit': locked poles or 'trackball': free rotations (default: 'trackball')
  cameraPosition: ThreeVector3;
  cameraLookAt: ThreeVector3;
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

  public readonly scene: ThreeScene;

  private readonly defaultCamera: ThreePerspectiveCamera | ThreeOrthographicCamera;

  public activeCamera: ThreePerspectiveCamera | ThreeOrthographicCamera | undefined;

  private renderer: ThreeWebGLRenderer;

  private readonly raycaster: ThreeRaycaster;

  private readonly raycastMouse: ThreeVector2;

  private defaultRaycastParent: ThreeScene | ThreeObject3D;

  private controls: OrbitControls | undefined;

  private controlsChangeCallback: (event: ThreeEvent) => void;

  // private cameraSpatialSettings: CameraSpatialSettings;

  private readonly axesHelper: ThreeAxesHelper;

  constructor(div: HTMLDivElement, options: ThreeContextOptions) {
    if (!div) {
      throw new Error('The ThreeContext needs a div object');
    }

    this.controlsChangeCallback = () => {};

    this.needRender = true;

    // perform some refresh every half second in case the needRender was forgotten tp toggle
    setInterval(() => {
      this.needRender = true;
    }, 500);

    this.requestFrameId = null;

    // init scene
    this.scene = new ThreeScene();

    // todo don't rely on the client width but on the projection size / final resolution
    this.defaultCamera = new ThreePerspectiveCamera(
      27,
      div.clientWidth / div.clientHeight,
      1,
      50000
    );
    const cameraPosition: [number, number, number] =
      'cameraPosition' in options
        ? (options.cameraPosition.clone().toArray() as [number, number, number])
        : [0, 0, 0];
    this.defaultCamera.position.set(...cameraPosition);

    // add some axis helper
    this.axesHelper = new ThreeAxesHelper(
      'axisHelperSize' in options ? options.axisHelperSize : 100
    );
    if (options.showAxisHelper) {
      this.scene.add(this.axesHelper);
    }

    // init the renderer
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

      this.renderer = new ThreeWebGLRenderer({
        canvas,
        context,
      });
    } else {
      this.renderer = new ThreeWebGLRenderer({
        antialias: 'antialias' in options ? options.antialias : true,
        alpha: true,
        preserveDrawingBuffer: true,
      });
    }

    this.renderer.domElement.style.boxShadow = `0 0 150px rgba(255, 255, 255, 0.4)`;

    this.renderer.setClearColor(0xffffff, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(div.clientWidth, div.clientHeight);
    div.appendChild(this.renderer.domElement);

    // Set up the default camera as active
    this.activateCamera(this.defaultCamera);

    // all the necessary for raycasting
    this.raycaster = new ThreeRaycaster();
    if (this.raycaster.params.Points) {
      this.raycaster.params.Points.threshold = 50; // distance in micron
    }
    if (this.raycaster.params.Line) this.raycaster.params.Line.threshold = 50; // distance in micron
    this.raycastMouse = new ThreeVector2();

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
      let aspectRatio: number | undefined;
      if (this.activeCamera?.type === 'OrthographicCamera') {
        const orthographicCamera = this.activeCamera as ThreeOrthographicCamera;
        const cameraWidth = Math.abs(orthographicCamera.left) + Math.abs(orthographicCamera.right);
        const cameraHeight = Math.abs(orthographicCamera.top) + Math.abs(orthographicCamera.bottom);
        aspectRatio = cameraWidth / cameraHeight;
      }
      this.resize(aspectRatio);
    });

    resizeObserver.observe(this.renderer.domElement.parentElement as HTMLElement);

    this.defaultRaycastParent = this.scene;

    const cameraLookAt =
      'cameraLookAt' in options ? options.cameraLookAt : new ThreeVector3(0, 0, 0);
    this.lookAt(cameraLookAt);

    window.addEventListener(
      'resize',
      () => {
        windowRect = this.renderer.domElement.getBoundingClientRect();

        if (this.activeCamera?.type === 'PerspectiveCamera') {
          (this.activeCamera as ThreePerspectiveCamera).aspect = div.clientWidth / div.clientHeight;
        }

        this.activeCamera?.updateProjectionMatrix();
        this.renderer.setSize(div.clientWidth, div.clientHeight);
      },
      false
    );

    this._animate();
  }

  setDefaultRaycastParent(obj: ThreeScene | ThreeObject3D) {
    this.defaultRaycastParent = obj;
  }

  /**
   * Resize the 3d render container to match a given width
   * @param aspectRatio
   */
  resize(aspectRatio?: number) {
    const canvas = this.renderer.domElement;
    const width = canvas.parentElement?.clientWidth ?? 600;
    const height = aspectRatio ? width / aspectRatio : canvas.parentElement?.clientHeight ?? 600;
    this.renderer.setSize(width, height, true);
    if (this.activeCamera?.type === 'PerspectiveCamera') {
      (this.activeCamera as ThreePerspectiveCamera).aspect = aspectRatio ?? width / height;
    }
    this.activeCamera?.updateProjectionMatrix();
  }

  /**
   * Get the scene, mainly so that we can externalize things from this file
   * @return {ThreeScene}
   */
  getScene() {
    return this.scene;
  }

  /**
   * Get the camera
   * @return {ThreeCamera}
   */
  getCamera() {
    return this.defaultCamera;
  }

  setControlsChangeCallback(callback: (event: ThreeEvent) => void) {
    this.controlsChangeCallback = callback;
  }

  activateCamera(newCamera: ThreePerspectiveCamera | ThreeOrthographicCamera) {
    if (this.activeCamera) {
      this.scene.remove(this.activeCamera);
    }
    this.activeCamera = newCamera;
    this.scene.add(newCamera);
    this.reassignControlsToActiveCamera();
    this.activeCamera.updateMatrix();
    this.activeCamera.updateProjectionMatrix();
    this.needRender = true;
  }

  reassignControlsToActiveCamera() {
    this.controls?.dispose();
    this.controls = new OrbitControls(this.activeCamera as ThreeCamera, this.renderer.domElement);
    this.controls.rotateSpeed *= 1;

    // @ts-ignore
    this.controls.addEventListener('change', (event: ThreeEvent) => {
      this.controlsChangeCallback(event.target);
      this.needRender = true;
    });
  }

  /**
   * Since we are using Controls, applying the lookat just on the camera in not enough
   * @param {ThreeVector3} pos - a position to look at
   */
  lookAt(pos: ThreeVector3) {
    this.needRender = true;
    this.controls?.target.set(pos.x, pos.y, pos.z);
  }

  /**
   * @private
   * deals with rendering and updating the controls
   */
  _animate = () => {
    this.requestFrameId = requestAnimationFrame(this._animate);
    this.controls?.update();

    if (this.needRender && this.activeCamera) {
      this.renderer?.render(this.scene, this.activeCamera);
      this.needRender = false;
    }
  };

  setCameraPosition(newPosition: [number, number, number]) {
    this.needRender = true;
    this.activeCamera?.position.set(...newPosition);
  }
}

export default ThreeContext;
