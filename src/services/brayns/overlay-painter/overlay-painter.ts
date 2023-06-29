/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable import/extensions */
import {
  Scene as ThreeScene,
  OrthographicCamera as ThreeOrthographicCamera,
  WebGLRenderer as ThreeWebGLRenderer,
  Group as ThreeGroup,
  Mesh as ThreeMesh,
} from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

import State from '../state';
import Calc from '../utils/calc';
import {
  applyModifierForBrightness,
  applyModifierForOpacity,
  applyModifierForThickness,
  generateGhostMaterial,
} from './material';

/**
 * This name is used to make the difference between real meshes and other objects
 * like lights, cameras, ...
 */
const MESH_NAME = 'Mesh';

export default class OverlayPainter {
  private readonly scene: ThreeScene;

  private readonly camera: ThreeOrthographicCamera;

  private readonly renderer: ThreeWebGLRenderer;

  private readonly meshes = new Map<string, ThreeGroup>();

  private loader = new OBJLoader();

  constructor(private readonly canvas: HTMLCanvasElement) {
    const cameraHalfHeight = State.camera.value.distance / 2;
    const scene = new ThreeScene();
    const camera = new ThreeOrthographicCamera(
      -cameraHalfHeight,
      +cameraHalfHeight,
      +cameraHalfHeight,
      -cameraHalfHeight,
      0.1,
      1e6
    );
    const renderer = new ThreeWebGLRenderer({
      alpha: true,
      preserveDrawingBuffer: false,
      premultipliedAlpha: true,
      canvas,
    });
    renderer.setClearColor(0xffffff, 0);
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
  }

  /**
   * Add a mesh to the scene if it does not already exists.
   * @param id Unique ID of the mesh (could be the mesh Obj URL, for instance).
   * @param content Obj file content.
   * @param color Hexadecimal representation of the color (ex.: #ef489d)
   */
  addMesh(id: string, content: string, color: string) {
    const { scene, meshes } = this;
    if (meshes.has(id)) return;

    const group = this.loader.parse(content);
    const material = generateGhostMaterial(
      `${color}`,
      State.overlay.meshes.opacity.value,
      State.overlay.meshes.brightness.value,
      State.overlay.meshes.thickness.value
    );
    group.traverse((obj) => {
      if (obj instanceof ThreeMesh) {
        obj.material = material;
      }
    });
    group.name = MESH_NAME;
    scene.add(group);
    this.meshes.set(id, group);
  }

  /**
   * Remove a mesh from the scene.
   * @param id Most of the time, we will use the mesh Obj URL as unique identifier.
   */
  removeMesh(id: string) {
    const group = this.meshes.get(id);
    if (!group) return;

    this.scene.remove(group);
    this.meshes.delete(id);
  }

  /**
   * Paint the scene on the canvas given in the constructor.
   * @param resizeCanvas Set the resolution of the canvas to fits its CSS current size.
   */
  paint(resizeCanvas: boolean) {
    if (resizeCanvas) {
      const { canvas } = this;
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }
    this.resetCamera();
    this.resetMaterial();
    this.renderer.render(this.scene, this.camera);
  }

  private resetMaterial() {
    const { scene } = this;
    scene.children
      .filter((g) => g.name === MESH_NAME)
      .forEach((group) => {
        group.traverse((obj) => {
          if (obj instanceof ThreeMesh) {
            const mesh = obj as unknown as MeshWithMaterial;
            const { uAlpha, uBright, uThick } = mesh.material.uniforms;
            if (!uAlpha) throw Error('Missing uniform uAlpha!');
            if (!uBright) throw Error('Missing uniform uBright!');
            if (!uThick) throw Error('Missing uniform uThick!');

            uAlpha.value = applyModifierForOpacity(State.overlay.meshes.opacity.value);
            uBright.value = applyModifierForBrightness(State.overlay.meshes.brightness.value);
            uThick.value = applyModifierForThickness(State.overlay.meshes.thickness.value);
          }
        });
      });
  }

  private resetCamera() {
    const { renderer, camera, canvas } = this;
    renderer.setSize(canvas.width, canvas.height, false);
    const braynsCamera = State.camera.value;
    const axis = Calc.getAxisFromQuaternion(braynsCamera.orientation);
    const [tx, ty, tz] = braynsCamera.target;
    const height = braynsCamera.distance / 2;
    /**
     * In orthographic projection, camera can be far away to
     * prevent strange behaviour with ghosting material.
     */
    const FAR_AWAY = 100;
    const [px, py, pz] = Calc.addVectors(
      braynsCamera.target,
      Calc.scaleVector(axis.z, -height * FAR_AWAY)
    );
    const width = (height * canvas.width) / canvas.height;
    camera.up.set(...axis.y);
    camera.left = -width;
    camera.right = width;
    camera.top = height;
    camera.bottom = -height;
    camera.near = 1e-3;
    camera.far = 1e7;
    camera.position.set(px, py, pz);
    camera.lookAt(tx, ty, tz);
    camera.updateMatrix();
    camera.updateProjectionMatrix();
  }
}

interface MeshWithMaterial {
  material: {
    uniforms: {
      [key: string]: { value: number };
    };
  };
}
