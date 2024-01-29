import CameraTransform from '@brayns/utils/camera-transform';
import OverlayPainter from '@brayns/../circuit/overlay-painter';
import { BraynsMeshOptions } from '@brayns/types';
import { loadMeshFromNexus } from '@brayns/utils/nexus';
import Gestures from '@brayns/utils/gestures';
import { logError } from '@/util/logger';
import { AtlasVisualizationManager } from '@/state/atlas/atlas';

export default class OverlayManager {
  private requestAnimationFrameId = 0;

  private readonly painter: OverlayPainter;

  private readonly gestures = new Gestures();

  private readonly keysOfDisplayedMeshes = new Set<string>();

  private nextMeshesToDisplay: BraynsMeshOptions[] | null = null;

  private busy = false;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly token: string,
    private readonly atlas: AtlasVisualizationManager
  ) {
    this.painter = new OverlayPainter(canvas);
    this.gestures.attach(canvas);
    this.gestures.eventDrag.addListener(handlePointerDrag);
    this.gestures.eventZoom.addListener(handleZoom);
  }

  detach() {
    this.gestures.detach(this.canvas);
  }

  paint() {
    window.cancelAnimationFrame(this.requestAnimationFrameId);
    this.requestAnimationFrameId = window.requestAnimationFrame(() => this.painter.paint(true));
  }

  showMeshes(meshes: BraynsMeshOptions[]) {
    this.nextMeshesToDisplay = meshes;
    if (this.busy) return;

    this.processMeshes();
  }

  private async processMeshes() {
    this.busy = true;
    const { nextMeshesToDisplay } = this;
    if (!nextMeshesToDisplay) {
      this.busy = false;
      return;
    }

    this.removeObsoleteMeshes();
    this.painter.paint(true);
    for (;;) {
      const mesh = this.findNextMeshToAdd();
      if (!mesh) break;

      try {
        this.atlas.updateVisibleMesh({
          contentURL: mesh.url,
          isLoading: true,
        });
        const content = await loadMeshFromNexus(mesh.url, this.token);
        this.keysOfDisplayedMeshes.add(mesh.url);
        this.painter.addMesh(mesh.url, content, mesh.color);
        this.painter.paint(true);
      } catch (ex) {
        logError('Unable to load a mesh:', ex);
      } finally {
        this.atlas.updateVisibleMesh({
          contentURL: mesh.url,
          isLoading: false,
        });
      }
    }
    this.busy = false;
  }

  private findNextMeshToAdd(): BraynsMeshOptions | undefined {
    const { nextMeshesToDisplay } = this;
    if (!nextMeshesToDisplay) return undefined;

    for (const mesh of nextMeshesToDisplay) {
      if (!this.keysOfDisplayedMeshes.has(mesh.url)) return mesh;
    }
    return undefined;
  }

  private removeObsoleteMeshes() {
    const keysOfMeshesToDisplay = this.getKeysOfMeshesToDisplay();
    Array.from(this.keysOfDisplayedMeshes).forEach((id) => {
      if (!keysOfMeshesToDisplay.has(id)) {
        this.keysOfDisplayedMeshes.delete(id);
        this.painter.removeMesh(id);
        this.atlas.updateVisibleMesh({
          contentURL: id,
          isLoading: false,
        });
      }
    });
  }

  private getKeysOfMeshesToDisplay(): Set<string> {
    const set = new Set<string>();
    const { nextMeshesToDisplay } = this;
    if (nextMeshesToDisplay) {
      nextMeshesToDisplay.forEach((mesh) => set.add(mesh.url));
    }
    return set;
  }
}

function handleZoom(direction: number) {
  if (direction < 0) CameraTransform.zoomIn();
  else CameraTransform.zoomOut();
}

function handlePointerDrag({
  deltaX,
  deltaY,
  button,
  isKeyPressed,
}: {
  deltaX: number;
  deltaY: number;
  button: number;
  isKeyPressed: (key: string) => boolean;
}) {
  /* Scaling is used to mitigate the mouse speed */
  const shift = isKeyPressed('Shift');
  const scaleX = shift ? 0.5 : 5;
  const scaleY = shift ? 0.5 : 5;
  if (button === 0) {
    // Left mouse button: Orbiting.
    if (isKeyPressed('z')) {
      CameraTransform.rotateAroundZ(-deltaX * scaleX);
    } else {
      if (!isKeyPressed('y')) CameraTransform.rotateAroundX(deltaY * scaleY);
      if (!isKeyPressed('x')) CameraTransform.rotateAroundY(-deltaX * scaleX);
    }
    return;
  }
  // Translating.
  CameraTransform.translate(deltaX * scaleX, deltaY * scaleY);
}
