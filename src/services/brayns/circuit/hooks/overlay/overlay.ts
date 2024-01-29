import { useCallback, useEffect, useRef } from 'react';
import OverlayManager from './manager';
import State from '@brayns/state';
import { BraynsMeshOptions } from '@brayns/types';
import { useAtlasVisualizationManager, useVisibleMeshes } from '@/state/atlas';

export function useOverlay(token?: string): {
  handleOverlayCanvasMount: (canvas: HTMLCanvasElement | null) => void;
} {
  const atlas = useAtlasVisualizationManager();
  const refMeshes = useRef<BraynsMeshOptions[]>([]);
  const refManager = useRef<OverlayManager | null>(null);
  const visibleMeshes = useVisibleMeshes();
  const paint = useCallback(() => {
    const painter = refManager.current;
    if (!painter) return;

    window.requestAnimationFrame(() => painter.paint());
  }, []);
  useEffect(() => {
    const meshes: BraynsMeshOptions[] = visibleMeshes.map((mesh) => ({
      url: mesh.contentURL,
      color: mesh.color,
    }));
    const manager = refManager.current;
    if (!manager) {
      refMeshes.current = meshes;
      return;
    }
    manager.showMeshes(meshes);
  }, [visibleMeshes]);
  useEffect(() => {
    State.camera.addListener(paint);
    paint();
    return () => State.camera.removeListener(paint);
  }, [paint]);
  return {
    handleOverlayCanvasMount: useCallback(
      (canvas: HTMLCanvasElement | null) => {
        if (!canvas || !token) return;

        refManager.current = new OverlayManager(canvas, token, atlas);
        refManager.current.showMeshes(refMeshes.current);
      },
      [token, atlas]
    ),
  };
}
