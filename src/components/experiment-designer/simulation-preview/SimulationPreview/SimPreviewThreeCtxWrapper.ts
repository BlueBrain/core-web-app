import * as THREE from 'three';
import { ThreeCtxWrapper } from '@/visual/ThreeCtxWrapper';
import { DEFAULT_CAMERA_LOOK_AT } from '@/state/experiment-designer/visualization';

class SimPreviewThreeCtxWrapper extends ThreeCtxWrapper {
  private cameraSymbolMesh: THREE.Mesh = new THREE.Mesh();

  private cameraLine: THREE.Line = new THREE.Line();

  drawCameraLookAtSymbol(customPosition: [number, number, number] | null = null) {
    console.debug('drawCameraSymbol', customPosition, this.threeContext);
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
}

const simPreviewThreeCtxWrapper = new SimPreviewThreeCtxWrapper();

export default simPreviewThreeCtxWrapper;
