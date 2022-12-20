import * as THREE from 'three';
import MorphologyHybrid from './morphologyGeneration/MorphologyHybrid';
import AtlasMesh from './AtlasMesh';

/**
 * Events expected:
 *
 * - 'meshLoaded': whenever a mesh is loaded. the callback of this event is called with the arg:
 *    @param {THREE.Mesh} mesh - mesh object
 *    @param {string} id - id of the mesh (as used within this collection)
 *
 * - 'onMeshLoadingProgress': when the loading status is updated. The callback arguments are:
 *    @param {string} id - id of the element that could not be loaded
 *    @param {string} step - name of the step being in progression (ie. 'parsing')
 *    @param {number} progress - percentage of progress on the 'step'
 *
 * - 'onMeshLoadError': whenever a mesh could not be loaded, for various reasons. Args of the callbac:
 *    @param {Error} error - the error explaining what was wrong
 *    @param {string} id - id of the element that could not be loaded
 *
 * - 'onMeshLoadWarning': when mesh is asked to be loaded but it's already being processed or in the loaded.
 *    Note that this is based on the ID, not the URL
 *    @param {string} message - the explanation
 *    @param {string} id - ID of the mesh being loaded
 *
 */
class MeshCollection {
  constructor(threeContext = null) {
    this.threeContext = threeContext;

    this.container = new THREE.Object3D();
    this.container.name = 'meshContainer';
    this.threeContext.getScene().add(this.container);
    this.threeContext.setDefaultRaycastParent(this.container);
    this.collection = {};
  }

  /**
   * Add a mesh to the collection (and scene). The mesh object must already be constructed
   * @param {THREE.Mesh} mesh - the mesh to add
   * @param {string} id - id to give to this mesh
   * @param {boolean} focusOn - OPTIONAL focus the camera on this mesh (default: false)
   */
  addMesh(mesh, id, focusOn = false) {
    const currentMesh = mesh;
    currentMesh.name = id;
    this.collection[id] = mesh;
    this.container.add(mesh);
    if (focusOn) {
      this.focusOn(id);
    }
    this.threeContext.needRender = true;
  }

  /**
   * Focus on a mesh given its id. The mesh must already be in the collection
   * @param {string} id - the id of the mesh
   */
  focusOn(id) {
    // the mesh is not in the collection
    if (!(id in this.collection)) return;

    const mesh = this.collection[id];
    // the bounding spher can come from the geometry (in a mesh) or directly from a mesh (ie. MorphologyHybrid)
    const boundingSphere = mesh.boundingSphere || mesh.geometry.boundingSphere;

    const lookatPos = boundingSphere.center;
    const cam = this.threeContext.getCamera();
    cam.position.set(lookatPos.x + boundingSphere.radius * 4, lookatPos.y, lookatPos.z);
    cam.up.set(0, -1, 0);
    this.threeContext.lookAt(boundingSphere.center);
  }

  /**
   * Is a mesh with such id in the collection?
   * @return {boolean} true if present in collection, false if not
   */
  has(id) {
    return id in this.collection;
  }

  /**
   * Show the mesh that has such id
   */
  show(id) {
    if (id in this.collection) {
      this.collection[id].visible = true;
      this.threeContext.needRender = true;
    }
  }

  /**
   * Returns a mesh, if it exists. If not returns null
   *
   * @param id
   * @returns {null|*}
   */
  getMesh(id) {
    if (id in this.collection) {
      return this.collection[id];
    }
    return null;
  }

  /**
   * Whether the id is already visible or not
   * @param id
   * @returns {false}
   */
  isVisible(id) {
    return id in this.collection && this.collection[id].visible;
  }

  /**
   * Hide the mesh that has such id
   */
  hide(id) {
    if (id in this.collection) {
      this.collection[id].visible = false;
      this.threeContext.needRender = true;
    }
  }

  /**
   * Hides all the meshes of the current atlas
   */
  hideAllMeshes() {
    Object.keys(this.collection).forEach((id) => {
      this.hide(id);
    });
  }

  /**
   * Adds or shows a mesh based on whether it already exists or not
   *
   * @param id
   * @param object3D
   * @param focus
   */
  addOrShowMesh(id, object3D, focus = false) {
    if (this.has(id)) {
      this.show(id);
    } else {
      this.addMesh(object3D, id, focus);
    }
  }

  /**
   * Returns all the currently visible meshes
   *
   * @returns {*[]}
   */
  getAllVisibleMeshes() {
    const visible = [];
    Object.keys(this.collection).forEach((id) => {
      if (this.collection[id].visible) {
        visible.push(id);
      }
    });
    return visible;
  }

  detachAllFromContainer() {
    Object.keys(this.collection).forEach((id) => {
      this.detach(id);
    });
  }

  /**
   * Detach the mesh instance from the collection (and from the container).
   * Thought, the mesh instance is not destroyed and is returned.
   * @param {string} id - if of the mesh to detach
   * @return {THREE.Mesh|THREE.Object3D|null} the detached mesh or null if there was nothing to detach
   */
  detach(id) {
    if (id in this.collection) {
      // this._container
      const mesh = this.collection[id];
      this.container.remove(mesh);
      delete this.collection[id];
      this.threeContext.needRender = true;
      return mesh;
    }
    return null;
  }

  /**
   * Get the container of all the objects
   */
  getContainer() {
    return this.container;
  }

  /**
   * Update the color of a mesh/pointcloud
   * @param {string} id - the id of the mesh or pointcloud
   * @param {string|number|object} color - a color, compatible with THREE js way of describing colors.
   */
  updateColor(id, color) {
    if (id in this.collection) {
      this.collection[id].material.uniforms.color.value = new THREE.Color(color);
      this.threeContext.needRender = true;
    }
  }

  /**
   * Get all the IDs of the mesh present in the collection
   * @returns Array of strings
   */
  getAllIds() {
    return Object.keys(this.collection);
  }
}

export default MeshCollection;
