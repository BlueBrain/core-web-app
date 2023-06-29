// @ts-nocheck
import { Object3D } from 'three';

const CAMERA_DISTANCE_OFFSET = 1;

// This is a temporary fix
// THIS CODE IS MEANT TO BE REMOVED
// that addresses focus problems in the morphoviewer library
// this higher order function patches a morphoviewer instance
// with a working focus funciton.
// https://discourse.threejs.org/t/camera-zoom-to-fit-object/936/24
const withFixedFocusOnMorphology = (morphoViewer) => {
  const viewer = morphoViewer;

  viewer._threeContext.getMorphoFromCollection = function getMorphoFromCollection(name = null) {
    let morphoName = name;
    // if no name of morphology is provided, we take the first one
    if (!morphoName) {
      const allNames = Object.keys(this._morphologyMeshCollection);
      if (allNames.length) {
        [morphoName] = allNames;
      } else {
        return null;
      }
    }

    const morphoMesh = this._morphologyMeshCollection[morphoName];

    return morphoMesh;
  };

  viewer.isInterneuron = function isInterneuron(): boolean {
    // Interneurons do not have an apical dendrite, the pinkish colored dendrites
    const morphoMesh = this._threeContext.getMorphoFromCollection();
    return !morphoMesh.children.find((child) => child?.userData?.typename === 'apical_dendrite');
  };

  viewer._threeContext.getSomaChildren = function getSomaChildren(): Object3D[] {
    const morphoMesh = this.getMorphoFromCollection();
    return (morphoMesh.children as Object3D[]).filter(
      (object) => object.userData.typename === 'soma'
    );
  };

  viewer._threeContext.getOrphanedSomaChildren = function getOrphanedSomaChildren(): Object3D {
    // it looks like the orphaned soma construction doesn't have a name
    // we can use that to reliably get the orphaned soma
    const morphoMesh = this.getMorphoFromCollection();
    return (morphoMesh.children as Object3D[]).filter((object) => object.name === '')[0];
  };

  viewer._threeContext.removeOrphanedSomaChildren =
    function removeOrphanedSomaChildren(): Object3D {
      // it looks like the orphaned soma construction doesn't have a name
      // we can use that to reliably get the orphaned soma
      const morphoMesh = this.getMorphoFromCollection();
      const orphanedSoma = this.getOrphanedSomaChildren();
      morphoMesh.remove(orphanedSoma);
    };

  viewer._threeContext.getTargetPointFromSoma = function getTargetPointFromSoma(): THREE.Vecor3 {
    const morphoMesh = this.getMorphoFromCollection();
    // Get the coordinates for the center of the soma
    // This will be the point we want the camera to focus on!

    // NOTE: this function falls back to bounding box center even if soma is generated
    // via orphaned sections
    let targetPoint = morphoMesh.getTargetPoint();

    // Does the soma exist or was it automatically generated?
    const somaCenterTargetExists = !!morphoMesh._pointToTarget;

    // If soma was generated using orphaned sections
    // then we need to get the soma mesh and use the coordintates from that
    if (!somaCenterTargetExists) {
      // in the case where the soma was automatically generated
      // by guessing the shape from the orphaned sections
      // the soma will be added to the Morphology Object3D last
      const soma = morphoMesh.children[morphoMesh.children.length - 1];

      const somaBoundingBox = new THREE.Box3();
      somaBoundingBox.expandByObject(soma);

      // set the new target point from the soma's bounding box
      // instead of the entire neuron bounding box
      targetPoint = somaBoundingBox.getCenter(new THREE.Vector3());
    }
    return targetPoint;
  };

  viewer._threeContext.getCameraHeightAtMorpho = function getCameraHeightAtMorpho(): number {
    const targetPoint = this.getTargetPointFromSoma();

    this._camera.updateMatrixWorld();

    const cameraPosVector = (this._camera as THREE.PerspectiveCamera).position.clone();

    const distance = cameraPosVector.distanceTo(targetPoint);

    // Calculate the visible height (the height of camera frustrum)
    // at the point it intersects with the morphology soma
    const vFOV = (this._camera.fov * Math.PI) / 180; // convert vertical fov to radians
    const height = 2 * Math.tan(vFOV / 2) * distance; // visible height

    return height;
  };

  viewer._threeContext.focusOnMorphology = function focusOnMorphology(name = null) {
    const morphoMesh = this.getMorphoFromCollection(name);

    const fitOffset = CAMERA_DISTANCE_OFFSET;

    const box = new THREE.Box3();

    box.expandByObject(morphoMesh);

    const size = box.getSize(new THREE.Vector3());

    const maxSize = Math.max(size.x, size.y, size.z);
    const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * this._camera.fov) / 360));
    const fitWidthDistance = fitHeightDistance / this._camera.aspect;
    const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance);

    const direction = this._controls.target
      .clone()
      .sub(this._camera.position)
      .normalize()
      .multiplyScalar(distance);

    this._controls.maxDistance = distance * 10;

    const targetPoint = this.getTargetPointFromSoma();

    // Look at our new center point
    this._camera.lookAt(targetPoint);
    // apply soma center coordinates as OrbitControls target
    // this will center the controls around it for rotation
    this._controls.target.copy(targetPoint);

    this._camera.near = distance / 100;
    this._camera.far = distance * 100;
    this._camera.updateProjectionMatrix();

    this._camera.position.copy(this._controls.target).sub(direction);
    this._camera.rotation.set(new THREE.Vector3());

    this._controls.update();

    this._render();
  };

  return viewer;
};

export default withFixedFocusOnMorphology;
