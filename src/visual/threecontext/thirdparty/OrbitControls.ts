import {
  Camera as ThreeCamera,
  OrthographicCamera as ThreeOrthographicCamera,
  PerspectiveCamera as ThreePerspectiveCamera,
  EventDispatcher as ThreeEventDispatcher,
  Vector2 as ThreeVector2,
  Vector3 as ThreeVector3,
  Quaternion as ThreeQuaternion,
  Spherical as ThreeSpherical,
  MOUSE as ThreeMOUSE,
} from 'three';

const STATE = {
  NONE: -1,
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
  TOUCH_ROTATE: 3,
  TOUCH_DOLLY: 4,
  TOUCH_PAN: 5,
};

const CHANGE_EVENT = { type: 'change' };
const START_EVENT = { type: 'start' };
const END_EVENT = { type: 'end' };
const EPS = 0.000001;

function checkPerspectiveCamera(camera: ThreeCamera): camera is ThreePerspectiveCamera {
  return (camera as ThreePerspectiveCamera).isPerspectiveCamera;
}

function checkOrthographicCamera(camera: ThreeCamera): camera is ThreeOrthographicCamera {
  return (camera as ThreeOrthographicCamera).isOrthographicCamera;
}

/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 * @author nicolaspanel / http://github.com/nicolaspanel
 *
 * This set of controls performs orbiting, dollying (zooming), and panning.
 * Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
 *    Orbit - left mouse / touch: one finger move
 *    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
 *    Pan - right mouse, or arrow keys / touch: three finger swipe
 */
export default class OrbitControls extends ThreeEventDispatcher {
  object: ThreeCamera;

  domElement: HTMLElement | Document;

  window: Window;

  // API
  enabled: boolean;

  target: ThreeVector3;

  enableZoom: boolean;

  zoomSpeed: number;

  minDistance: number;

  maxDistance: number;

  enableRotate: boolean;

  rotateSpeed: number;

  enablePan: boolean;

  keyPanSpeed: number;

  autoRotate: boolean;

  autoRotateSpeed: number;

  minZoom: number;

  maxZoom: number;

  minPolarAngle: number;

  maxPolarAngle: number;

  minAzimuthAngle: number;

  maxAzimuthAngle: number;

  enableKeys: boolean;

  keys: { LEFT: number; UP: number; RIGHT: number; BOTTOM: number };

  mouseButtons: { ORBIT: ThreeMOUSE; ZOOM: ThreeMOUSE; PAN: ThreeMOUSE };

  enableDamping: boolean;

  dampingFactor: number;

  private readonly spherical: ThreeSpherical;

  private sphericalDelta: ThreeSpherical;

  private scale: number;

  private readonly target0: ThreeVector3;

  private readonly position0: ThreeVector3;

  private zoom0: any;

  private state: number;

  private readonly panOffset: ThreeVector3;

  private zoomChanged: boolean;

  private readonly rotateStart: ThreeVector2;

  private readonly rotateEnd: ThreeVector2;

  private rotateDelta: ThreeVector2;

  private readonly panStart: ThreeVector2;

  private readonly panEnd: ThreeVector2;

  private panDelta: ThreeVector2;

  private readonly dollyStart: ThreeVector2;

  private readonly dollyEnd: ThreeVector2;

  private dollyDelta: ThreeVector2;

  private updateLastPosition: ThreeVector3;

  private readonly updateOffset: ThreeVector3;

  private readonly updateQuat: ThreeQuaternion;

  private updateLastQuaternion: ThreeQuaternion;

  private readonly updateQuatInverse: ThreeQuaternion;

  private readonly panLeftV: ThreeVector3;

  private readonly panUpV: ThreeVector3;

  private panInternalOffset: ThreeVector3;

  private readonly onContextMenu: EventListener;

  private readonly onMouseUp: EventListener;

  private readonly onMouseDown: EventListener;

  private readonly onMouseMove: EventListener;

  private readonly onMouseWheel: EventListener;

  private readonly onTouchStart: EventListener;

  private readonly onTouchEnd: EventListener;

  private readonly onTouchMove: EventListener;

  private readonly onKeyDown: EventListener;

  private readonly applyRotation: () => void;

  constructor(object: ThreeCamera, domElement?: HTMLElement, domWindow?: Window) {
    super();
    this.object = object;

    this.domElement = domElement !== undefined ? domElement : document;
    this.window = domWindow !== undefined ? domWindow : window;

    // Set to false to disable this control
    this.enabled = true;

    // "target" sets the location of focus, where the object orbits around
    this.target = new ThreeVector3();

    // How far you can dolly in and out ( PerspectiveCamera only )
    this.minDistance = 0;
    this.maxDistance = Infinity;

    // How far you can zoom in and out ( OrthographicCamera only )
    this.minZoom = 0;
    this.maxZoom = Infinity;

    // How far you can orbit vertically, upper and lower limits.
    // Range is 0 to Math.PI radians.
    this.minPolarAngle = 0; // radians
    this.maxPolarAngle = Math.PI; // radians

    // How far you can orbit horizontally, upper and lower limits.
    // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
    this.minAzimuthAngle = -Infinity; // radians
    this.maxAzimuthAngle = Infinity; // radians

    // Set to true to enable damping (inertia)
    // If damping is enabled, you must call controls.update() in your animation loop
    this.enableDamping = false;
    this.dampingFactor = 0.25;

    // This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
    // Set to false to disable zooming
    this.enableZoom = true;
    this.zoomSpeed = 1.0;

    // Set to false to disable rotating
    this.enableRotate = true;
    this.rotateSpeed = 1.0;

    // Set to false to disable panning
    this.enablePan = true;
    this.keyPanSpeed = 7.0; // pixels moved per arrow key push

    // Set to true to automatically rotate around the target
    // If auto-rotate is enabled, you must call controls.update() in your animation loop
    this.autoRotate = false;
    this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

    // Set to false to disable use of the keys
    this.enableKeys = false;

    // The four arrow keys
    this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

    // Mouse buttons
    this.mouseButtons = {
      ORBIT: ThreeMOUSE.LEFT,
      ZOOM: ThreeMOUSE.MIDDLE,
      PAN: ThreeMOUSE.RIGHT,
    };

    // for reset
    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.zoom0 = (this.object as any).zoom;

    // for update speedup
    this.updateOffset = new ThreeVector3();
    // so camera.up is the orbit axis
    this.updateQuat = new ThreeQuaternion().setFromUnitVectors(
      object.up,
      new ThreeVector3(0, 1, 0)
    );
    this.updateQuatInverse = new ThreeQuaternion().copy(this.updateQuat).invert();
    this.updateLastPosition = new ThreeVector3();
    this.updateLastQuaternion = new ThreeQuaternion();

    this.state = STATE.NONE;
    this.scale = 1;

    // current position in spherical coordinates
    this.spherical = new ThreeSpherical();
    this.sphericalDelta = new ThreeSpherical();

    this.panOffset = new ThreeVector3();
    this.zoomChanged = false;

    this.rotateStart = new ThreeVector2();
    this.rotateEnd = new ThreeVector2();
    this.rotateDelta = new ThreeVector2();

    this.panStart = new ThreeVector2();
    this.panEnd = new ThreeVector2();
    this.panDelta = new ThreeVector2();

    this.dollyStart = new ThreeVector2();
    this.dollyEnd = new ThreeVector2();
    this.dollyDelta = new ThreeVector2();

    this.panLeftV = new ThreeVector3();
    this.panUpV = new ThreeVector3();
    this.panInternalOffset = new ThreeVector3();

    // event handlers - FSM: listen for events and reset state

    // @ts-ignore
    this.onMouseDown = (event: ThreeEvent) => {
      if (!this.enabled) return;
      event.preventDefault();
      if ((event as any).button === this.mouseButtons.ORBIT) {
        if (!this.enableRotate) return;
        this.rotateStart.set(event.clientX, event.clientY);
        this.state = STATE.ROTATE;
      } else if (event.button === this.mouseButtons.ZOOM) {
        if (!this.enableZoom) return;
        this.dollyStart.set(event.clientX, event.clientY);
        this.state = STATE.DOLLY;
      } else if (event.button === this.mouseButtons.PAN) {
        if (!this.enablePan) return;
        this.panStart.set(event.clientX, event.clientY);
        this.state = STATE.PAN;
      }

      if (this.state !== STATE.NONE) {
        document.addEventListener('mousemove', this.onMouseMove, false);
        document.addEventListener('mouseup', this.onMouseUp, false);
        this.dispatchEvent(START_EVENT);
      }
    };

    this.applyRotation = () => {
      this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);
      const element = this.domElement === document ? this.domElement.body : this.domElement;

      // rotating across whole screen goes 360 degrees around
      this.rotateLeft(
        ((2 * Math.PI * this.rotateDelta.x) / (element as any).clientWidth) * this.rotateSpeed
      );
      // rotating up and down along whole screen attempts to go 360, but limited to 180
      this.rotateUp(
        ((2 * Math.PI * this.rotateDelta.y) / (element as any).clientHeight) * this.rotateSpeed
      );
      this.rotateStart.copy(this.rotateEnd);

      this.update();
    };

    // @ts-ignore
    this.onMouseMove = (event: ThreeEvent) => {
      if (!this.enabled) return;

      event.preventDefault();

      if (this.state === STATE.ROTATE) {
        if (!this.enableRotate) return;
        this.rotateEnd.set(event.clientX, event.clientY);
        this.applyRotation();
      } else if (this.state === STATE.DOLLY) {
        if (!this.enableZoom) return;

        this.dollyEnd.set(event.clientX, event.clientY);
        this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart);

        if (this.dollyDelta.y > 0) {
          this.dollyIn(this.getZoomScale());
        } else if (this.dollyDelta.y < 0) {
          this.dollyOut(this.getZoomScale());
        }

        this.dollyStart.copy(this.dollyEnd);
        this.update();
      } else if (this.state === STATE.PAN) {
        if (!this.enablePan) return;

        this.panEnd.set(event.clientX, event.clientY);
        this.panDelta.subVectors(this.panEnd, this.panStart);
        this.pan(this.panDelta.x, this.panDelta.y);
        this.panStart.copy(this.panEnd);
        this.update();
      }
    };

    this.onMouseUp = () => {
      if (!this.enabled) return;
      document.removeEventListener('mousemove', this.onMouseMove, false);
      document.removeEventListener('mouseup', this.onMouseUp, false);

      this.dispatchEvent(END_EVENT);
      this.state = STATE.NONE;
    };

    // @ts-ignore
    this.onMouseWheel = (event: ThreeEvent) => {
      if (
        !this.enabled ||
        !this.enableZoom ||
        (this.state !== STATE.NONE && this.state !== STATE.ROTATE)
      )
        return;

      event.preventDefault();
      event.stopPropagation();

      if (event.deltaY < 0) {
        this.dollyOut(this.getZoomScale());
      } else if (event.deltaY > 0) {
        this.dollyIn(this.getZoomScale());
      }

      this.update();

      this.dispatchEvent(START_EVENT); // not sure why these are here...
      this.dispatchEvent(END_EVENT);
    };

    // @ts-ignore
    this.onKeyDown = (event: ThreeEvent) => {
      if (!this.enabled || !this.enableKeys || !this.enablePan) return;

      switch (event.keyCode) {
        case this.keys.UP:
          this.pan(0, this.keyPanSpeed);
          this.update();
          break;
        case this.keys.BOTTOM:
          this.pan(0, -this.keyPanSpeed);
          this.update();
          break;
        case this.keys.LEFT:
          this.pan(this.keyPanSpeed, 0);
          this.update();
          break;
        case this.keys.RIGHT:
          this.pan(-this.keyPanSpeed, 0);
          this.update();
          break;
        default:
          // eslint-disable-next-line no-console
          console.warn(`Unhandled key code: ${event.keyCode}`);
          break;
      }
    };

    // @ts-ignore
    this.onTouchStart = (event: ThreeEvent) => {
      if (!this.enabled) return;

      switch (event.touches.length) {
        // one-fingered touch: rotate
        case 1:
          if (!this.enableRotate) return;

          this.rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
          this.state = STATE.TOUCH_ROTATE;
          break;
        // two-fingered touch: dolly
        case 2:
          {
            if (!this.enableZoom) return;

            const dx = event.touches[0].pageX - event.touches[1].pageX;
            const dy = event.touches[0].pageY - event.touches[1].pageY;

            const distance = Math.sqrt(dx * dx + dy * dy);
            this.dollyStart.set(0, distance);
            this.state = STATE.TOUCH_DOLLY;
          }
          break;
        // three-fingered touch: pan
        case 3:
          if (!this.enablePan) return;

          this.panStart.set(event.touches[0].pageX, event.touches[0].pageY);
          this.state = STATE.TOUCH_PAN;
          break;
        default: {
          this.state = STATE.NONE;
        }
      }

      if (this.state !== STATE.NONE) {
        this.dispatchEvent(START_EVENT);
      }
    };

    // @ts-ignore
    this.onTouchMove = (event: ThreeEvent) => {
      if (!this.enabled) return;
      event.preventDefault();
      event.stopPropagation();

      const dx = event.touches[0].pageX - event.touches[1].pageX;
      const dy = event.touches[0].pageY - event.touches[1].pageY;

      const distance = Math.sqrt(dx * dx + dy * dy);

      switch (event.touches.length) {
        // one-fingered touch: rotate
        case 1:
          if (!this.enableRotate) return;
          if (this.state !== STATE.TOUCH_ROTATE) return; // is this needed?...

          this.rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
          this.applyRotation();
          break;
        // two-fingered touch: dolly
        case 2:
          if (!this.enableZoom) return;
          if (this.state !== STATE.TOUCH_DOLLY) return; // is this needed?...

          this.dollyEnd.set(0, distance);

          this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart);

          if (this.dollyDelta.y > 0) {
            this.dollyOut(this.getZoomScale());
          } else if (this.dollyDelta.y < 0) {
            this.dollyIn(this.getZoomScale());
          }

          this.dollyStart.copy(this.dollyEnd);
          this.update();
          break;
        // three-fingered touch: pan
        case 3:
          if (!this.enablePan) return;
          if (this.state !== STATE.TOUCH_PAN) return; // is this needed?...
          this.panEnd.set(event.touches[0].pageX, event.touches[0].pageY);
          this.panDelta.subVectors(this.panEnd, this.panStart);
          this.pan(this.panDelta.x, this.panDelta.y);
          this.panStart.copy(this.panEnd);
          this.update();
          break;
        default: {
          this.state = STATE.NONE;
        }
      }
    };

    this.onTouchEnd = () => {
      if (!this.enabled) return;
      this.dispatchEvent(END_EVENT);
      this.state = STATE.NONE;
    };

    this.onContextMenu = (event) => {
      event.preventDefault();
    };

    this.domElement.addEventListener('contextmenu', this.onContextMenu, false);

    this.domElement.addEventListener('mousedown', this.onMouseDown, false);
    this.domElement.addEventListener('wheel', this.onMouseWheel, false);

    this.domElement.addEventListener('touchstart', this.onTouchStart, false);
    this.domElement.addEventListener('touchend', this.onTouchEnd, false);
    this.domElement.addEventListener('touchmove', this.onTouchMove, false);

    this.window.addEventListener('keydown', this.onKeyDown, false);

    // force an update at start
    this.update();
  }

  update() {
    const { position } = this.object;
    this.updateOffset.copy(position).sub(this.target);

    // rotate offset to "y-axis-is-up" space
    this.updateOffset.applyQuaternion(this.updateQuat);

    // angle from z-axis around y-axis
    this.spherical.setFromVector3(this.updateOffset);

    if (this.autoRotate && this.state === STATE.NONE) {
      this.rotateLeft(this.getAutoRotationAngle());
    }

    (this.spherical as any).theta += (this.sphericalDelta as any).theta;
    (this.spherical as any).phi += (this.sphericalDelta as any).phi;

    // restrict theta to be between desired limits
    (this.spherical as any as any).theta = Math.max(
      this.minAzimuthAngle,
      Math.min(this.maxAzimuthAngle, (this.spherical as any).theta)
    );

    // restrict phi to be between desired limits
    (this.spherical as any).phi = Math.max(
      this.minPolarAngle,
      Math.min(this.maxPolarAngle, (this.spherical as any).phi)
    );

    this.spherical.makeSafe();

    (this.spherical as any).radius *= this.scale;

    // restrict radius to be between desired limits
    (this.spherical as any).radius = Math.max(
      this.minDistance,
      Math.min(this.maxDistance, (this.spherical as any).radius)
    );

    // move target to panned location
    this.target.add(this.panOffset);

    this.updateOffset.setFromSpherical(this.spherical);

    // rotate offset back to "camera-up-vector-is-up" space
    this.updateOffset.applyQuaternion(this.updateQuatInverse);

    position.copy(this.target).add(this.updateOffset);

    this.object.lookAt(this.target);

    if (this.enableDamping) {
      (this.sphericalDelta as any).theta *= 1 - this.dampingFactor;
      (this.sphericalDelta as any).phi *= 1 - this.dampingFactor;
    } else {
      this.sphericalDelta.set(0, 0, 0);
    }

    this.scale = 1;
    this.panOffset.set(0, 0, 0);

    // update condition is:
    // min(camera displacement, camera rotation in radians)^2 > EPS
    // using small-angle approximation cos(x/2) = 1 - x^2 / 8

    if (
      this.zoomChanged ||
      this.updateLastPosition.distanceToSquared(this.object.position) > EPS ||
      8 * (1 - this.updateLastQuaternion.dot(this.object.quaternion)) > EPS
    ) {
      this.dispatchEvent(CHANGE_EVENT);
      this.updateLastPosition.copy(this.object.position);
      this.updateLastQuaternion.copy(this.object.quaternion);
      this.zoomChanged = false;
      return true;
    }
    return false;
  }

  panLeft(distance: number, objectMatrix: any) {
    this.panLeftV.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
    this.panLeftV.multiplyScalar(-distance);
    this.panOffset.add(this.panLeftV);
  }

  panUp(distance: number, objectMatrix: any) {
    this.panUpV.setFromMatrixColumn(objectMatrix, 1); // get Y column of objectMatrix
    this.panUpV.multiplyScalar(distance);
    this.panOffset.add(this.panUpV);
  }

  // deltaX and deltaY are in pixels; right and down are positive
  pan(deltaX: number, deltaY: number) {
    const element = this.domElement === document ? this.domElement.body : this.domElement;

    if (checkPerspectiveCamera(this.object)) {
      // perspective
      const { position } = this.object;
      this.panInternalOffset.copy(position).sub(this.target);
      let targetDistance = this.panInternalOffset.length();

      // half of the fov is center to top of screen
      targetDistance *= Math.tan(((this.object.fov / 2) * Math.PI) / 180.0);

      // we actually don't use screenWidth, since perspective camera is fixed to screen height
      this.panLeft(
        (2 * deltaX * targetDistance) / (element as any).clientHeight,
        this.object.matrix
      );
      this.panUp((2 * deltaY * targetDistance) / (element as any).clientHeight, this.object.matrix);
    } else if (checkOrthographicCamera(this.object)) {
      // orthographic
      this.panLeft(
        (deltaX * (this.object.right - this.object.left)) /
          this.object.zoom /
          (element as any).clientWidth,
        this.object.matrix
      );
      this.panUp(
        (deltaY * (this.object.top - this.object.bottom)) /
          this.object.zoom /
          (element as any).clientHeight,
        this.object.matrix
      );
    } else {
      // camera neither orthographic nor perspective
      // eslint-disable-next-line no-console
      console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
      this.enablePan = false;
    }
  }

  dollyIn(dollyScale: number) {
    if (checkPerspectiveCamera(this.object)) {
      this.scale /= dollyScale;
    } else if (checkOrthographicCamera(this.object)) {
      this.object.zoom = Math.max(
        this.minZoom,
        Math.min(this.maxZoom, this.object.zoom * dollyScale)
      );
      this.object.updateProjectionMatrix();
      this.zoomChanged = true;
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.'
      );
      this.enableZoom = false;
    }
  }

  dollyOut(dollyScale: number) {
    if (checkPerspectiveCamera(this.object)) {
      this.scale *= dollyScale;
    } else if (checkOrthographicCamera(this.object)) {
      this.object.zoom = Math.max(
        this.minZoom,
        Math.min(this.maxZoom, this.object.zoom / dollyScale)
      );
      this.object.updateProjectionMatrix();
      this.zoomChanged = true;
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.'
      );
      this.enableZoom = false;
    }
  }

  getAutoRotationAngle() {
    return ((2 * Math.PI) / 60 / 60) * this.autoRotateSpeed;
  }

  getZoomScale() {
    return 0.99 ** this.zoomSpeed;
  }

  rotateLeft(angle: number) {
    (this.sphericalDelta as any).theta -= angle;
  }

  rotateUp(angle: number) {
    (this.sphericalDelta as any).phi -= angle;
  }

  getPolarAngle(): number {
    return (this.spherical as any).phi;
  }

  getAzimuthalAngle(): number {
    return (this.spherical as any).theta;
  }

  dispose(): void {
    this.domElement.removeEventListener('contextmenu', this.onContextMenu, false);
    this.domElement.removeEventListener('mousedown', this.onMouseDown, false);
    this.domElement.removeEventListener('wheel', this.onMouseWheel, false);

    this.domElement.removeEventListener('touchstart', this.onTouchStart, false);
    this.domElement.removeEventListener('touchend', this.onTouchEnd, false);
    this.domElement.removeEventListener('touchmove', this.onTouchMove, false);

    document.removeEventListener('mousemove', this.onMouseMove, false);
    document.removeEventListener('mouseup', this.onMouseUp, false);

    this.window.removeEventListener('keydown', this.onKeyDown, false);
    // this.dispatchEvent( { type: 'dispose' } ); // should this be added here?
  }

  reset(): void {
    this.target.copy(this.target0);
    this.object.position.copy(this.position0);
    (this.object as any).zoom = this.zoom0;

    (this.object as any).updateProjectionMatrix();
    this.dispatchEvent(CHANGE_EVENT);

    this.update();

    this.state = STATE.NONE;
  }

  saveState(): void {
    this.target0.copy(this.target);
    this.position0.copy(this.object.position);
    // Check whether the camera has zoom property
    if (checkOrthographicCamera(this.object) || checkPerspectiveCamera(this.object)) {
      this.zoom0 = this.object.zoom;
    }
  }

  // backward compatibility
  get center(): ThreeVector3 {
    // eslint-disable-next-line no-console
    console.warn('ThreeOrbitControls: .center has been renamed to .target');
    return this.target;
  }

  get noZoom(): boolean {
    // eslint-disable-next-line no-console
    console.warn('ThreeOrbitControls: .noZoom has been deprecated. Use .enableZoom instead.');
    return !this.enableZoom;
  }

  set noZoom(value: boolean) {
    // eslint-disable-next-line no-console
    console.warn('ThreeOrbitControls: .noZoom has been deprecated. Use .enableZoom instead.');
    this.enableZoom = !value;
  }
}

interface ThreeEvent extends Event {
  clientX: number;
  clientY: number;
  deltaY: number;
  button: ThreeMOUSE;
  touches: Array<any>;
  keyCode: number;
}
