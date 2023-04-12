import * as THREE from 'three';
import TrackballControls from './thirdparty/TrackballControls';
import OrbitControls from './thirdparty/OrbitControls';

/* eslint no-use-before-define: "off" */
/* eslint no-shadow: "off" */
/* eslint prefer-destructuring: "off" */
/* eslint no-var: "off" */
/* eslint vars-on-top: "off" */
/* eslint no-restricted-properties: "off" */
/* eslint object-shorthand: "off" */
/* eslint prefer-exponentiation-operator: "off" */
/* eslint no-unused-vars: "off" */
/* eslint default-param-last: "off" */
/* eslint prefer-const: "off" */
/* eslint no-empty: "off" */

/**
 * ThreeContext creates a WebGL context using Threejs. It also handle mouse control with two possible logics
 * (orbit or trackball)
 * An event can be associated to a ThreeContext instance: `raycast` with the method
 * `.on("raycast", function(hits){...})` where `hits` is the object list being raycasted.
 */
class ThreeContext {
  /**
   * Constuctor
   * @param {DOMObject} div - the div object as a DOM element.
   * @param {Object} options - the options parameters
   * @param {boolean}   options.webgl2 - enable WebGL2 if `true` (default: `false`)
   * @param {boolean}   options.embedLight - embeds the light into the camera if `true` (default: `false`)
   * @param {boolean}   options.antialias - enables antialias if `true` (default: `true`)
   * @param {boolean}   options.showAxisHelper - show the axis helper at (0, 0, 0) when `true` (default: `false`)
   * @param {number}    options.axisHelperSize - length of the the 3 axes of the helper (default: `100`)
   * @param {Object}    options.cameraPosition - init position of the camera (default: `{x: 0, y: 0, z: 100}`)
   * @param {Object}    options.cameraLookAt - init position to look at (default: `{x: 0, y: 0, z: 0}`)
   * @param {string}    options.controlType - `'orbit'`: locked poles or `'trackball'`:
   * free rotations (default: `'trackball'`)
   * @param {boolean}   options.raycastOnDoubleClick - perform a raycast when double clicking (default: `true`).
   * If some object from the scene are raycasted, the event 'raycast' is emitted with the list of intersected object
   * from the scene as argument.
   */
  constructor(div = null, options) {
    if (!div) {
      throw new Error('The ThreeContext needs a div object');
    }

    this.needRender = true;

    // perform some refresh every half second in case the needRender was forgotten tp toggle
    setInterval(() => {
      this.needRender = true;
    }, 500);

    this._requestFrameId = null;

    // init scene
    this._scene = new THREE.Scene();

    // init camera
    this._camera = new THREE.PerspectiveCamera(27, div.clientWidth / div.clientHeight, 1, 50000);
    let camPos = 'cameraPosition' in options ? options.cameraPosition : new THREE.Vector3(0, 0, 0);
    this._camera.position.x = camPos.x;
    this._camera.position.y = camPos.y;
    this._camera.position.z = camPos.z;
    this._scene.add(this._camera);
    this._camera.updateMatrix();
    this._cameraSpatialSettings = {};

    // adding some light
    this._ambiantLight = new THREE.AmbientLight(0x444444);
    this._scene.add(this._ambiantLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    if (options.embedLight) {
      this._camera.add(pointLight);
    } else {
      this._scene.add(pointLight);
    }

    // add some axis helper
    if (options.showAxisHelper) {
      this._axesHelper = new THREE.AxesHelper(
        'axisHelperSize' in options ? options.axisHelperSize : 100
      );
      this._scene.add(this._axesHelper);
    }

    // init the renderer
    this._renderer = null;
    if ('webgl2' in options ? options.webgl2 : true) {
      let canvas = document.createElement('canvas');
      canvas.style.cssText = 'width:100%;';
      div.appendChild(canvas);
      let context = canvas.getContext('webgl2', {
        preserveDrawingBuffer:
          'preserveDrawingBuffer' in options ? options.preserveDrawingBuffer : false,
        alpha: true,
        antialias: 'antialias' in options ? options.antialias : true,
      });

      this._renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        context: context,
      });
    } else {
      this._renderer = new THREE.WebGLRenderer({
        antialias: 'antialias' in options ? options.antialias : true,
        alpha: true,
        preserveDrawingBuffer: true,
      });
    }

    this._renderer.setClearColor(0xffffff, 0);
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(div.clientWidth, div.clientHeight);
    // this._renderer.gammaInput = true
    // this._renderer.gammaOutput = true
    div.appendChild(this._renderer.domElement);

    // all the necessary for raycasting
    this._raycaster = new THREE.Raycaster();
    this._raycaster.params.Points.threshold = 50; // distance in micron
    this._raycaster.linePrecision = 50; // (older version, to remove when updating ThreeJs version)
    this._raycaster.params.Line.threshold = 50; // distance in micron
    this._raycastMouse = new THREE.Vector2();
    let windowRect = this._renderer.domElement.getBoundingClientRect();

    // improve this
    this._renderer.domElement.addEventListener(
      'mousemove',
      (event) => {
        const relX = event.clientX - windowRect.left;
        const relY = event.clientY - windowRect.top;
        this._raycastMouse.x = (relX / this._renderer.domElement.clientWidth) * 2 - 1;
        this._raycastMouse.y = -(relY / this._renderer.domElement.clientHeight) * 2 + 1;
      },
      false
    );

    // when the 3D container resizes, calls the resize function to re-calculate the width
    const resizeObserver = new ResizeObserver(() => {
      this.resize();
    });

    resizeObserver.observe(this._renderer.domElement.parentElement);

    this._defaultRaycastParent = this._scene;

    if ('raycastOnDoubleClick' in options ? options.raycastOnDoubleClick : false) {
    }

    // mouse controls
    const controlType = 'controlType' in options ? options.controlType : 'trackball';
    this._controls = null;
    if (controlType === 'trackball') {
      this._controls = new TrackballControls(this._camera, this._renderer.domElement);
      this._controls.rotateSpeed = 3;
    } else if (controlType === 'orbit') {
      this._controls = new OrbitControls(this._camera, this._renderer.domElement);
      this._controls.rotateSpeed *= -1;
    }

    let cameraLookAt =
      'cameraLookAt' in options ? options.cameraLookAt : new THREE.Vector3(0, 0, 0);
    this.lookAt(cameraLookAt);

    window.addEventListener(
      'resize',
      () => {
        windowRect = this._renderer.domElement.getBoundingClientRect();
        this._camera.aspect = div.clientWidth / div.clientHeight;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(div.clientWidth, div.clientHeight);

        // this actually applies only to trackball control
        try {
          this._controls.handleResize();
        } catch (e) {}
      },
      false
    );

    // event for camera move
    this._controls.addEventListener('change', (evt) => {
      this.needRender = true;
    });

    this._animate();
  }

  setDefaultRaycastParent(obj) {
    this._defaultRaycastParent = obj;
  }

  /**
   * Resize the 3d render container to match a given width
   * @param width the width to match
   */
  resize() {
    const canvas = this._renderer.domElement;
    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight;
    // look up the size the canvas is being displayed
    this._renderer.setSize(width, height, true);
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
  }

  saveCameraSpatialSettings() {
    this._cameraSpatialSettings.position = this._camera.position.clone();
    this._cameraSpatialSettings.up = this._camera.up.clone();
    this._cameraSpatialSettings.lookat = this.getLookAt();
    // this._cameraSpatialSettings.rotation = this._camera.rotation.clone()
    // this._cameraSpatialSettings.quaternion = this._camera.quaternion.clone()
  }

  resetCameraSpatialSettings() {
    this.needRender = true;
    this._camera.position.copy(this._cameraSpatialSettings.position);
    this._camera.up.copy(this._cameraSpatialSettings.up);
    this.lookAt(this._cameraSpatialSettings.lookat);
    // this._camera.rotation.copy(this._cameraSpatialSettings.rotation)
    // this._camera.quaternion.copy(this._cameraSpatialSettings.quaternion)
  }

  /**
   * Get the default AmbientLight
   * @return {THREE.AmbientLight}
   */
  getAmbientLight() {
    return this._ambiantLight;
  }

  /**
   * Get the axes helper
   * @return {THREE.Mesh}
   */
  getAxesHelper() {
    return this._axesHelper;
  }

  /**
   * Get the scene, mainly so that we can externalize things from this file
   * @return {THREE.Scene}
   */
  getScene() {
    return this._scene;
  }

  /**
   * Get the camera
   * @return {THREE.Camera}
   */
  getCamera() {
    return this._camera;
  }

  /**
   * Since we are using Controls, applying the lookat just on the camera in not enough
   * @param {THREE.Vector3} pos - a position to look at
   */
  lookAt(pos) {
    this.needRender = true;
    this._controls.target.set(pos.x, pos.y, pos.z);
  }

  getLookAt() {
    return this._controls.target.clone();
  }

  lookAtxyz(x, y, z) {
    this.needRender = true;
    this._controls.target.set(x, y, z);
  }

  /**
   * Get the field of view angle of the camera, in degrees
   * @return {Number}
   */
  getCameraFieldOfView() {
    return this._camera.fov;
  }

  /**
   * Define the camera field of view, in degrees
   * @param {Number} fov - the fov
   */
  setCameraFieldOfView(fov) {
    this.needRender = true;
    this._camera.fov = fov;
    this._camera.updateProjectionMatrix();
  }

  /**
   * @private
   * deals with rendering and updating the controls
   */
  _animate = () => {
    this._requestFrameId = requestAnimationFrame(this._animate);
    this._controls.update();

    if (this.needRender) {
      this._renderer.render(this._scene, this._camera);
      this.needRender = false;
    }
  };

  /**
   * Throw a ray from the camera to the pointer, potentially intersect some element.
   * Can emit the event `raycast` with the section instance as argument
   * @param {{parent: *}}  options - the option object
   * @param {boolean} options.emitEvent - Throw the event `'raycast'` with the intersected objects in arguments
   * (default: `false`, the result is returned)
   * @param {THREE.Object3D} options.parent - the raycast will be performed recursively on all the children of this
   * object (default: `this._scene`)
   * @return {array|null} an array of interections or null if none
   */
  performRaycast(options) {
    let parent = 'parent' in options ? options.parent : this._scene;

    // update the picking ray with the camera and mouse position
    this._raycaster.setFromCamera(this._raycastMouse, this._camera);

    // calculate objects intersecting the picking ray
    const intersects = this._raycaster.intersectObject(parent, true);

    // For complex objects (Object3D) composed of multiple sub meshes,
    // the raycaster will hit the children, reulting in not hitting the parent.
    // Here we correct this list with a bottom-up approach to find the relevant parent
    // (the parent mesh/Object3D that is directly the child of the above 'parent')
    const filteredIntersects = [];
    const namesOfInterest = {}; // a list just of names of the objects of interest
    intersects.forEach((hit) => {
      const distance = hit.distance;
      const point = hit.point;
      const object = hit.object;

      let objectOfInterest = object;
      let parentOfOOI = objectOfInterest.parent;

      // bottom-up until the parent is the above 'parent' (or scene)
      while (parentOfOOI !== parent) {
        objectOfInterest = parentOfOOI;
        parentOfOOI = objectOfInterest.parent;
      }

      // already in the list
      if (objectOfInterest.name in namesOfInterest) {
        return;
      }

      // just adding to a fast map, with a dummy value (cause we just care about the key here)
      namesOfInterest[objectOfInterest.name] = true;
      filteredIntersects.push({
        distance,
        point,
        object: objectOfInterest,
      });
    });

    return filteredIntersects;
  }

  /**
   * Get the png image data as base64, in order to later display it in a <img> markup
   */
  getScreenshot() {
    const strMime = 'image/png';
    return this._renderer.domElement.toDataURL(strMime);
  }

  /**
   * Kills the scene, interaction, animation and reset all objects to null
   */
  destroy() {
    this._controls.dispose();
    cancelAnimationFrame(this._requestFrameId);
    this._camera = null;
    this._controls = null;
    this._scene = null;
    this._renderer.domElement.remove();
    this._renderer = null;
  }
}

export default ThreeContext;
