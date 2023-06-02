import * as THREE from 'three';
import { ThreeCtxWrapper, ThreeCtxWrapperInitParams } from '@/visual/ThreeCtxWrapper';
import { DEFAULT_CAMERA_LOOK_AT } from '@/state/experiment-designer/visualization';
import { ExpDesignerVisualizationConfig } from '@/types/experiment-designer-visualization';

class SimPreviewThreeCtxWrapper extends ThreeCtxWrapper {
  private cameraSymbolMesh: THREE.Mesh = new THREE.Mesh();

  private cameraLine: THREE.Line = new THREE.Line();

  private overviewCamera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();

  private movieCamera: THREE.OrthographicCamera = new THREE.OrthographicCamera();

  init({
    targetDiv,
    cameraPositionXYZ = [37984.948, 3938.164, 5712.791],
    cameraLookAtXYZ = [6612.504, 3938.164, 5712.791],
  }: ThreeCtxWrapperInitParams) {
    super.init({
      targetDiv,
      cameraPositionXYZ,
      cameraLookAtXYZ,
    });

    this.overviewCamera = this.threeContext?.getCamera() as THREE.PerspectiveCamera;

    const movieCameraWidth = 1920;
    const movieCameraHeight = 1080;
    const movieCameraScaleFactor = 5;
    this.movieCamera = new THREE.OrthographicCamera(
      -movieCameraWidth * movieCameraScaleFactor,
      +movieCameraWidth * movieCameraScaleFactor,
      +movieCameraHeight * movieCameraScaleFactor,
      -movieCameraHeight * movieCameraScaleFactor,
      0.1,
      1e6
    );
    this.movieCamera.position.set(...(cameraPositionXYZ ?? [0, 0, 0]));
    this.movieCamera.up.set(0, -1, 0);
    this.movieCamera.lookAt(6612.504, 3938.164, 5712.791);
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
    this.threeContext?.lookAt(new THREE.Vector3(...cameraLookAt));
  }

  drawCameraLookAtSymbol() {
    const targetPoint = new THREE.Vector3(...DEFAULT_CAMERA_LOOK_AT);

    const drawLookAtSphere = () => {
      const sphereGeometry = new THREE.SphereGeometry(100, 32, 32);
      const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphereMesh.position.set(targetPoint.x, targetPoint.y, targetPoint.z);
      this.threeContext?.scene.add(sphereMesh);
    };

    drawLookAtSphere();
  }

  drawCameraSymbol(position: [number, number, number]) {
    const endPoint = new THREE.Vector3(...DEFAULT_CAMERA_LOOK_AT);

    const drawCameraSphere = () => {
      this.threeContext?.scene.remove(this.cameraSymbolMesh);
      const sphereGeometry = new THREE.SphereGeometry(200, 32, 32);
      const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphereMesh.position.set(...position);
      this.cameraSymbolMesh = sphereMesh;
      this.threeContext?.scene.add(this.cameraSymbolMesh);
    };

    const drawCameraLine = () => {
      this.threeContext?.scene.remove(this.cameraLine);
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(6); // 3 coordinates per point, 2 points
      positions.set(position, 0);
      positions.set(endPoint.toArray(), 3);
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
      this.cameraLine = new THREE.Line(geometry, material);
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
