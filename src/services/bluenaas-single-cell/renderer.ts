import throttle from 'lodash/throttle';
import isEqual from 'lodash/isEqual';
import differenceWith from 'lodash/differenceWith';
import {
  AmbientLight,
  Color,
  CylinderGeometry,
  DoubleSide,
  EdgesGeometry,
  Fog,
  InstancedBufferGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshLambertMaterial,
  MeshPhongMaterial,
  Object3D,
  PerspectiveCamera,
  PointLight,
  Raycaster,
  Scene,
  SphereGeometry,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import RendererCtrl from './renderer-ctrl';
import type { Morphology, SecMarkerConfig } from './types';
import { createSegMarkerMesh, createSegmentMesh } from './renderer-utils';
import { sendSegmentDetailsEvent } from './events';

import { basePath } from '@/config';
import { SynapsesMesh } from '@/components/build-section/virtual-lab/synaptome/events';

const FOG_COLOR = 0xffffff;
const FOG_NEAR = 1;
const FOG_FAR = 50000;
const AMBIENT_LIGHT_COLOR = 0x555555;
const CAMERA_LIGHT_COLOR = 0xcacaca;
const BACKGROUND_COLOR = 0x000103;
const HOVER_BOX_COLOR = 0xffdf00;

const CLICK_DELAY_TOLERANCE = 500; // ms
const CLICK_POS_TOLERANCE = 5; // px

const TEXTURE_BASE_URL = `${basePath}/images/e-model-interactive`;
export type SynapseBubble = Mesh<SphereGeometry, MeshPhongMaterial>;
export type SynapseBubblesMesh = Mesh<InstancedBufferGeometry, MeshPhongMaterial>;

export type ClickData = {
  type: string;
  data: any;
  position: {
    x: number;
    y: number;
  };
};

export type HoverData = {
  type: string;
  data: any;
};

export type NeuronViewerConfig = {
  onClick?: (data: ClickData) => void;
  onHover?: (data: HoverData) => void;
  onHoverEnd?: (data: HoverData) => void;
};

function disposeMesh(mesh: Mesh | LineSegments) {
  mesh.geometry.dispose();

  if (Array.isArray(mesh.material)) {
    mesh.material.forEach((material) => material.dispose());
  } else {
    mesh.material.dispose();
  }
}

const SOMA_COLOR = 0xf5f5f5;
const AXON_COLOR = 0x5c81ff;
const DEND_COLOR = 0xfe395b;
const APIC_COLOR = 0xa922a8;
const SPINE_COLOR = 0xff9900;
const EXC_COLOR = 0xff0000;
const INH_COLOR = 0x6699ff;

const getColor = (name: string) => {
  let color = 0x888888;
  if (/^soma/.test(name)) {
    color = SOMA_COLOR;
  } else if (/^axon/.test(name)) {
    color = AXON_COLOR;
  } else if (/^dend/.test(name)) {
    color = DEND_COLOR;
  } else if (/^apic/.test(name)) {
    color = APIC_COLOR;
  } else if (/^spine/.test(name)) {
    color = SPINE_COLOR;
  } else if (/^exc/.test(name)) {
    color = EXC_COLOR;
  } else if (/^inh/.test(name)) {
    color = INH_COLOR;
  }
  return color;
};

function getElementOffset(element: HTMLElement): { x: number; y: number } {
  const elBoundingRect = element.getBoundingClientRect();
  const bodyBoundingRect = document.body.getBoundingClientRect();

  const x = elBoundingRect.left;
  const y = elBoundingRect.top - bodyBoundingRect.top;

  return { x, y };
}

type MorphMesh = Mesh<CylinderGeometry, MeshLambertMaterial>;
type HoverBox = LineSegments<EdgesGeometry, LineBasicMaterial>;
export default class NeuronViewerRenderer {
  private container: HTMLDivElement;

  private containerOffset: { x: number; y: number };

  private renderer: WebGLRenderer;

  private ctrl: RendererCtrl;

  private scene: Scene;

  private raycaster: Raycaster;

  private camera: PerspectiveCamera;

  private controls: OrbitControls;

  private config: NeuronViewerConfig;

  private pointerDownTimestamp: number | null = null;

  private mouseNative = new Vector2();

  private mouseGl = new Vector2();

  private hoveredMesh: MorphMesh | null = null;

  private injMarkerMaterial: MeshLambertMaterial;

  private recMarkerMaterial: MeshLambertMaterial;

  private secMarkerObj: Object3D = new Object3D();

  private hoverBox: HoverBox | null = null;

  private morphObj: Object3D = new Object3D();

  private morphology: Morphology | null = null;

  private resizeObserver: ResizeObserver;

  private animationFrameHandle: number | null = null;

  private synapses: Array<SynapsesMesh> = [];

  constructor(container: HTMLDivElement, config: NeuronViewerConfig) {
    this.config = config;

    this.container = container;
    const { clientWidth, clientHeight } = container;

    this.resizeObserver = new ResizeObserver(this.onResize);
    this.resizeObserver.observe(container);

    this.containerOffset = getElementOffset(container);

    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    container.appendChild(this.renderer.domElement);

    this.ctrl = new RendererCtrl();

    this.renderer.setSize(clientWidth, clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.scene = new Scene();
    this.scene.background = new Color(BACKGROUND_COLOR);
    this.scene.fog = new Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);
    this.scene.add(new AmbientLight(AMBIENT_LIGHT_COLOR));
    this.scene.add(this.morphObj);
    this.scene.add(this.secMarkerObj);

    this.raycaster = new Raycaster();

    const segInjTexture = new TextureLoader().load(`${TEXTURE_BASE_URL}/seg-inj-texture.png`);
    const segRecTexture = new TextureLoader().load(`${TEXTURE_BASE_URL}/seg-rec-texture.png`);

    this.recMarkerMaterial = new MeshLambertMaterial({
      color: 0x00bfff,
      opacity: 0.6,
      map: segRecTexture,
      transparent: true,
      side: DoubleSide,
      depthWrite: false,
    });

    this.injMarkerMaterial = new MeshLambertMaterial({
      color: 0xffa500,
      opacity: 0.6,
      map: segInjTexture,
      transparent: true,
      side: DoubleSide,
      depthWrite: false,
    });

    this.camera = new PerspectiveCamera(45, clientWidth / clientHeight, 0.01, 100000);
    this.scene.add(this.camera);
    this.camera.add(new PointLight(CAMERA_LIGHT_COLOR, 0.9));

    this.camera.position.setZ(-400);
    this.camera.lookAt(new Vector3());
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.screenSpacePanning = true;
    this.initEventHandlers();
    this.startRenderLoop();
  }

  private initEventHandlers() {
    const eventListenerCfg = { capture: false, passive: true };

    this.renderer.domElement.addEventListener('click', this.onClick, eventListenerCfg);
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown, eventListenerCfg);
    this.renderer.domElement.addEventListener('wheel', this.onMouseWheel, eventListenerCfg);
    this.renderer.domElement.addEventListener('pointermove', this.onPointerMove, eventListenerCfg);
  }

  private disposeEventHandlers() {
    this.renderer.domElement.removeEventListener('click', this.onClick);
    this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
    this.renderer.domElement.removeEventListener('wheel', this.onMouseWheel);
    this.renderer.domElement.removeEventListener('pointermove', this.onPointerMove);
  }

  private onPointerDown = (e: MouseEvent) => {
    this.pointerDownTimestamp = Date.now();
    this.mouseNative.set(e.clientX, e.clientY);
  };

  private onMouseWheel = () => {
    this.ctrl.renderOnce();
  };

  private onClick = (e: MouseEvent) => {
    if (!this.config.onClick) return;

    if (
      Math.abs(Date.now() - (this.pointerDownTimestamp as number)) > CLICK_DELAY_TOLERANCE ||
      Math.abs(this.mouseNative.x - e.clientX) > CLICK_POS_TOLERANCE ||
      Math.abs(this.mouseNative.y - e.clientY) > CLICK_POS_TOLERANCE
    )
      return;

    const clickedMesh = this.getMeshByNativeCoordinates(e.clientX, e.clientY);
    if (!clickedMesh) return;
    this.config.onClick({
      type: clickedMesh.name,
      data: clickedMesh.userData,
      position: {
        x: e.clientX,
        y: e.clientY,
      },
    });
  };

  private onPointerMove = throttle((e: PointerEvent) => {
    this.ctrl.renderFor(2000);

    if (e.buttons) return;

    const mesh = this.getMeshByNativeCoordinates(e.clientX, e.clientY);

    if (mesh && this.hoveredMesh && mesh.uuid === this.hoveredMesh.uuid) return;

    if (this.hoveredMesh) {
      this.onHoverEnd(this.hoveredMesh);
      this.hoveredMesh = null;
    }

    if (mesh) {
      this.onHover(mesh);
      this.hoveredMesh = mesh;
    }
  }, 100);

  private onHover(mesh: MorphMesh) {
    const geometry = new EdgesGeometry(mesh.geometry);
    const material = new LineBasicMaterial({
      color: HOVER_BOX_COLOR,
      linewidth: 2,
    });
    this.hoverBox = new LineSegments(geometry, material);

    mesh.getWorldPosition(this.hoverBox.position);
    mesh.getWorldQuaternion(this.hoverBox.quaternion);
    this.hoverBox.name = mesh.name;

    this.hoverBox.userData = { ...mesh.userData, skipHoverDetection: true };
    this.scene.add(this.hoverBox);

    this.config.onHover?.({
      type: 'morphSection',
      data: mesh.userData,
    });
    sendSegmentDetailsEvent({ show: true, data: mesh.userData });
    this.ctrl.renderOnce();
  }

  private onHoverEnd(mesh: MorphMesh) {
    sendSegmentDetailsEvent({ show: false });
    this.scene.remove(this.hoverBox as HoverBox);
    disposeMesh(this.hoverBox as HoverBox);
    this.hoverBox = null;

    this.config.onHoverEnd?.({
      type: 'morphSection',
      data: mesh.userData,
    });

    this.ctrl.renderOnce();
  }

  private onResize = () => {
    if (!this.renderer.domElement.parentElement) return;

    this.containerOffset = getElementOffset(this.container);

    const { clientWidth, clientHeight } = this.renderer.domElement.parentElement;
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight);

    this.ctrl.renderOnce();
  };

  private getMeshByNativeCoordinates(x: number, y: number) {
    this.mouseGl.x = ((x - this.containerOffset.x) / this.renderer.domElement.clientWidth) * 2 - 1;
    this.mouseGl.y =
      -((y - this.containerOffset.y) / this.renderer.domElement.clientHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouseGl, this.camera);
    const intersections = this.raycaster.intersectObject<MorphMesh>(this.morphObj, true);

    return intersections.find((mesh) => !mesh.object.userData.skipHoverDetection)?.object;
  }

  private startRenderLoop = () => {
    if (this.ctrl.needsRender) {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }

    this.animationFrameHandle = requestAnimationFrame(this.startRenderLoop);
  };

  public set configOnClick(onClick: (data: ClickData) => void) {
    this.config.onClick = onClick;
  }

  public set configOnHover(onHover: (data: HoverData) => void) {
    this.config.onHover = onHover;
  }

  public set configOnHoverEnd(onHoverEnd: (data: HoverData) => void) {
    this.config.onHoverEnd = onHoverEnd;
  }

  removeNoDiameterSection(morphology: Morphology) {
    // workaround sinde the implementation of stub axon in hoc files
    const pruned = Object.entries(morphology).reduce((acc: Morphology, [secName, sec]) => {
      if (!sec.diam) return acc;

      acc[secName] = sec;
      return acc;
    }, {});
    return pruned satisfies Morphology;
  }

  addMorphology = (morphology: Morphology) => {
    this.morphology = morphology;

    const allSegNames = [];
    const secNSegs = [];
    const secNames = [];

    Object.keys(morphology).forEach((secName) => {
      const sec = morphology[secName];
      secNSegs[sec.index] = sec.nseg;
      secNames[sec.index] = secName;

      for (let segIdx = 0; segIdx < sec.diam.length; segIdx += 1) {
        const openEnded = !/^spine/.test(secName);
        const color = getColor(secName);
        const mesh = createSegmentMesh(sec, segIdx, openEnded, color);

        const name = `${secName}_${segIdx}`;
        mesh.name = name;

        allSegNames.push(name);

        this.morphObj.add(mesh);
      }
    });

    this.ctrl.renderOnce();
  };

  addSynapses = (mesh: SynapsesMesh) => {
    this.scene.add(mesh);
    this.synapses.push(mesh);
    this.ctrl.renderOnce();
  };

  removeSynapses = (meshId: string) => {
    const object = this.scene.getObjectByProperty('uuid', meshId);
    if (object) {
      this.scene.remove(object);
      this.synapses = this.synapses.filter((s) => s.uuid !== meshId);
      this.ctrl.renderOnce();
    }
  };

  cleanSynapses = () => {
    this.synapses.forEach(o => {
      this.scene.remove(o);
    });
    this.synapses = [];
    this.ctrl.renderOnce();
  };

  private addSecMarker = (config: SecMarkerConfig) => {
    if (!this.morphology) {
      throw new Error("Morphology couldn't be found");
    }

    const material = config.type === 'recording' ? this.recMarkerMaterial : this.injMarkerMaterial;

    const sec = this.morphology[config.secName];

    if (config.type === 'recording') {
      const mesh = createSegMarkerMesh(sec, config.segIdx, material);
      mesh.userData = { config, skipHoverDetection: true };

      this.secMarkerObj.add(mesh);
    } else {
      const stimulusSecMarkerObj = new Object3D();
      for (let segIdx = 0; segIdx < sec.diam.length; segIdx += 1) {
        const mesh = createSegMarkerMesh(sec, segIdx, material);
        mesh.userData = { config, skipHoverDetection: true };

        stimulusSecMarkerObj.add(mesh);
      }

      stimulusSecMarkerObj.userData = { config, skipHoverDetection: true };

      this.secMarkerObj.add(stimulusSecMarkerObj);
    }
  };

  private removeSecMarker(config: SecMarkerConfig) {
    const secMarkerObj = this.secMarkerObj.children.find((obj) =>
      isEqual(obj.userData.config, config)
    );

    if (!secMarkerObj) {
      throw new Error("Couldn't find section marker object with the supplied configuration");
    }

    secMarkerObj.removeFromParent();

    // Dispose.
    if (secMarkerObj instanceof Object3D) {
      Array.from(secMarkerObj.children as Mesh[]).forEach((mesh) => {
        mesh.removeFromParent();
        disposeMesh(mesh);
      });
    } else {
      disposeMesh(secMarkerObj);
    }
  }

  ensureSecMarkers = (configs: SecMarkerConfig[]) => {
    const existingMarkerConfigs = this.secMarkerObj.children.map<SecMarkerConfig>(
      (obj) => obj.userData.config
    );

    const toCreate = differenceWith(configs, existingMarkerConfigs, isEqual);
    const toRemove = differenceWith(existingMarkerConfigs, configs, isEqual);

    toCreate.forEach((config) => this.addSecMarker(config));
    toRemove.forEach((config) => this.removeSecMarker(config));

    this.ctrl.renderOnce();
  };

  destroy = () => {
    if (this.animationFrameHandle) {
      cancelAnimationFrame(this.animationFrameHandle);
    }

    this.morphObj.children.forEach((mesh) => disposeMesh(mesh as MorphMesh));

    this.disposeEventHandlers();

    this.resizeObserver.disconnect();

    this.controls.dispose();
    this.renderer.dispose();

    this.container.removeChild(this.renderer.domElement);
  };
}
