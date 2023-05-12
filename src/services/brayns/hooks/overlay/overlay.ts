/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useVisibleMeshes } from '../../../../state/atlas';
import State from '../../state';
import { BraynsMeshOptions } from '../../types';
import OverlayManager from './manager';

export function useOverlay(token?: string): {
  handleOverlayCanvasMount: (canvas: HTMLCanvasElement | null) => void;
} {
  const refMeshes = React.useRef<BraynsMeshOptions[]>([]);
  const refManager = React.useRef<OverlayManager | null>(null);
  const visibleMeshes = useVisibleMeshes();
  const paint = React.useCallback(() => {
    const painter = refManager.current;
    if (!painter) return;

    window.requestAnimationFrame(() => painter.paint());
  }, []);
  React.useEffect(() => {
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
  React.useEffect(() => {
    State.camera.addListener(paint);
    paint();
    return () => State.camera.removeListener(paint);
  }, [paint]);
  return {
    handleOverlayCanvasMount: React.useCallback(
      (canvas: HTMLCanvasElement | null) => {
        if (!canvas || !token) return;

        refManager.current = new OverlayManager(canvas, token);
        refManager.current.showMeshes(refMeshes.current);
      },
      [token]
    ),
  };
}
