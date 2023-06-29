import {
  Object3D as ThreeObject3D,
  Vector3 as ThreeVector3,
  BufferGeometry as ThreeBufferGeometry,
  LineSegments as ThreeLineSegments,
  LineBasicMaterial as ThreeLineBasicMaterial,
  Scene as ThreeScene,
  WebGLRenderer as ThreeWebGLRenderer,
  Camera as ThreeCamera,
  PerspectiveCamera as ThreePerspectiveCamera,
} from 'three';

import { removeChildren } from './dom';
import { makeText } from './text';

const AXES_HELPER_SCALE = 15;

const createOrientationHelper = (): ThreeObject3D => {
  const orientationHelper = new ThreeObject3D();

  const colors = ['red', 'green', 'blue'];
  const axes = ['X', 'Z', 'Y'];

  // We need to swap Y for Z
  // because three.js uses an uncommon orientation format
  // therefore we will generate the Axes Helper ourselves
  const positions = [
    [AXES_HELPER_SCALE, 0, 0],
    [0, 0, AXES_HELPER_SCALE],
    [0, AXES_HELPER_SCALE, 0],
  ];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i <= 2; i++) {
    const color = colors[i];
    const position = new ThreeVector3(positions[i][0], positions[i][1], positions[i][2]);

    const geometry = new ThreeBufferGeometry();
    const points = [position, new ThreeVector3(0, 0, 0)];
    geometry.setFromPoints(points);
    const material = new ThreeLineBasicMaterial({
      color,
      linewidth: 1,
    });
    const line = new ThreeLineSegments(geometry, material);

    const label = axes[i];
    const axisLabel = makeText(label, { color });
    // Make sure the label has a little margin
    const labelPosition = position.clone().multiplyScalar(1.2);
    axisLabel?.position.set(labelPosition.x, labelPosition.y, labelPosition.z);

    axisLabel && orientationHelper.add(axisLabel, line); // eslint-disable-line @typescript-eslint/no-unused-expressions
  }

  return orientationHelper;
};

export default class OrientationViewer {
  private renderer: ThreeWebGLRenderer | null;

  private scene: ThreeScene | null;

  private camera: ThreeCamera | null;

  private orientationHelper: ThreeObject3D;

  private requestedAnimationFrameID: number = 0;

  public followCamera: ThreeCamera | null = null;

  handleResize() {
    const { clientHeight, clientWidth } = this.renderer?.domElement.parentNode as HTMLDivElement;

    this.renderer?.setSize(clientWidth, clientHeight);
  }

  constructor(private div: HTMLDivElement) {
    const canvas = document.createElement('canvas');
    div.appendChild(canvas);
    const context = canvas.getContext('webgl2', {
      // preserveDrawingBuffer: true,
      alpha: true,
      antialias: true,
    });

    this.renderer = new ThreeWebGLRenderer({
      canvas,
      context: context || undefined,
      alpha: true,
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(div.clientWidth, div.clientHeight);

    this.scene = new ThreeScene();
    this.camera = new ThreePerspectiveCamera(27, div.clientWidth / div.clientHeight, 1, 50000);
    const camPos = { x: 0, y: 0, z: 100 };
    this.camera.lookAt(new ThreeVector3(0, 0, 0));
    this.camera.position.x = camPos.x;
    this.camera.position.y = camPos.y;
    this.camera.position.z = camPos.z;
    this.scene.add(this.camera);

    this.orientationHelper = createOrientationHelper();
    this.scene.add(this.orientationHelper);

    window.addEventListener('resize', this.handleResize);

    this.animate();
  }

  setFollowCamera(camera: ThreeCamera) {
    this.followCamera = camera;
  }

  animate() {
    this.requestedAnimationFrameID = requestAnimationFrame(this.animate.bind(this));
    this.render();
  }

  render() {
    if (this.followCamera) {
      this.camera?.lookAt(this.orientationHelper.position.clone());
      this.orientationHelper.rotation.copy(this.followCamera.rotation.clone());

      // Invert the orientation of the object
      // because the camera is inverted (see MorphologyViewer.tsx)
      this.orientationHelper.scale.x = -1;
      this.orientationHelper.scale.y = -1;
      this.orientationHelper.scale.z = -1;
    }
    if (this.scene && this.camera && this.renderer) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    removeChildren(this.div);
    cancelAnimationFrame(this.requestedAnimationFrameID);
    this.scene = null;
    this.renderer = null;
    this.camera = null;
    window.removeEventListener('resize', this.handleResize);
  }
}
