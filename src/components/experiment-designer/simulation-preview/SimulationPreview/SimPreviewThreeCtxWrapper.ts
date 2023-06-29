import {
  Mesh as ThreeMesh,
  Line as ThreeLine,
  PerspectiveCamera as ThreePerspectiveCamera,
  OrthographicCamera as ThreeOrthographicCamera,
  Vector3 as ThreeVector3,
  SphereGeometry as ThreeSphereGeometry,
  MeshBasicMaterial as ThreeMeshBasicMaterial,
  LineBasicMaterial as ThreeLineBasicMaterial,
  BufferAttribute as ThreeBufferAttribute,
  BufferGeometry as ThreeBufferGeometry,
} from 'three';

import { ThreeCtxWrapper, ThreeCtxWrapperInitParams } from '@/visual/ThreeCtxWrapper';
import { DEFAULT_CAMERA_LOOK_AT } from '@/state/experiment-designer/visualization';
import { ExpDesignerVisualizationConfig } from '@/types/experiment-designer-visualization';

class SimPreviewThreeCtxWrapper extends ThreeCtxWrapper {
  private cameraSymbolMesh = new ThreeMesh();

  private cameraLine = new ThreeLine();

  private overviewCamera = new ThreePerspectiveCamera();

  private movieCamera = new ThreeOrthographicCamera();

  init({
    targetDiv,
    cameraPositionXYZ = [37984.948, 3938.164, 5712.791],
    cameraLookAtXYZ = [6612.504, 3938.164, 5712.791],
    movieCameraLookAtXYZ = [6612.504, 3938.164, 5712.791],
    movieCameraHeight = 1920 * 5,
    movieCameraAspect = 16 / 9,
    movieCameraUp = [0, -1, 0],
  }: ThreeCtxWrapperInitParams) {
    super.init({
      targetDiv,
      cameraPositionXYZ,
      cameraLookAtXYZ,
    });

    this.overviewCamera = this.threeContext?.getCamera() as ThreePerspectiveCamera;

    // Movie camera settings
    const movieCameraWidth = (movieCameraHeight ?? 1080) * movieCameraAspect;
    this.movieCamera = new ThreeOrthographicCamera(
      -movieCameraWidth / 2,
      +movieCameraWidth / 2,
      +movieCameraHeight / 2,
      -movieCameraHeight / 2,
      0.1,
      1e6
    );
    this.movieCamera.position.set(...(cameraPositionXYZ ?? [0, 0, 0]));
    this.movieCamera.up.set(...movieCameraUp);
    this.movieCamera.lookAt(...movieCameraLookAtXYZ);
    this.movieCamera.updateProjectionMatrix();
    this.movieCamera.updateMatrix();
  }

  syncWithCameraState(cameraConfig: ExpDesignerVisualizationConfig) {
    const activeCameraKey = cameraConfig.activeCamera;
    const activeCameraConfig = cameraConfig[activeCameraKey];
    const cameraPosition = activeCameraConfig.position;
    const cameraLookAt = activeCameraConfig.lookAt;
    let cameraAspect: number | undefined;

    if (activeCameraKey === 'movieCamera') {
      this.threeContext?.activateCamera(this.movieCamera);
      this.removeCameraSymbol();
      cameraAspect =
        cameraConfig.movieCamera.resolution.width / cameraConfig.movieCamera.resolution.height;
    } else {
      this.threeContext?.activateCamera(this.overviewCamera);
      this.drawCameraSymbol(cameraConfig.movieCamera.position);
    }

    this.threeContext?.resize(cameraAspect);
    this.threeContext?.setCameraPosition(cameraPosition);
    this.threeContext?.lookAt(new ThreeVector3(...cameraLookAt));
  }

  drawCameraLookAtSymbol() {
    const targetPoint = new ThreeVector3(...DEFAULT_CAMERA_LOOK_AT);

    const drawLookAtSphere = () => {
      const sphereGeometry = new ThreeSphereGeometry(100, 32, 32);
      const sphereMaterial = new ThreeMeshBasicMaterial({ color: 0xff0000 });
      const sphereMesh = new ThreeMesh(sphereGeometry, sphereMaterial);
      sphereMesh.position.set(targetPoint.x, targetPoint.y, targetPoint.z);
      this.threeContext?.scene.add(sphereMesh);
    };

    drawLookAtSphere();
  }

  drawCameraSymbol(position: [number, number, number]) {
    const endPoint = new ThreeVector3(...DEFAULT_CAMERA_LOOK_AT);

    const drawCameraSphere = () => {
      this.threeContext?.scene.remove(this.cameraSymbolMesh);
      const sphereGeometry = new ThreeSphereGeometry(200, 32, 32);
      const sphereMaterial = new ThreeMeshBasicMaterial({ color: 0x00ff00 });
      const sphereMesh = new ThreeMesh(sphereGeometry, sphereMaterial);
      sphereMesh.position.set(...position);
      this.cameraSymbolMesh = sphereMesh;
      this.threeContext?.scene.add(this.cameraSymbolMesh);
    };

    const drawCameraLine = () => {
      this.threeContext?.scene.remove(this.cameraLine);
      const geometry = new ThreeBufferGeometry();
      const positions = new Float32Array(6); // 3 coordinates per point, 2 points
      positions.set(position, 0);
      positions.set(endPoint.toArray(), 3);
      geometry.setAttribute('position', new ThreeBufferAttribute(positions, 3));
      const material = new ThreeLineBasicMaterial({ color: 0x00ff00 });
      this.cameraLine = new ThreeLine(geometry, material);
      this.threeContext?.scene.add(this.cameraLine);
    };

    drawCameraSphere();
    drawCameraLine();
  }

  removeCameraSymbol() {
    this.threeContext?.scene.remove(this.cameraSymbolMesh);
    this.threeContext?.scene.remove(this.cameraLine);
  }
}

const simPreviewThreeCtxWrapper = new SimPreviewThreeCtxWrapper();

export default simPreviewThreeCtxWrapper;
