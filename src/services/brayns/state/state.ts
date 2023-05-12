'use client';

import Settings from '../settings';
import AtomicState from './atomic-state';
import { isNumber } from '@/util/type-guards';

export default Object.freeze({
  camera: new AtomicState(Settings.CAMERA),
  /**
   * Overly is a WebGL layer to display everything that
   * Brayns won't display faster.
   * Transparent meshes, for instance, are very slow in
   * Brayns.
   */
  overlay: {
    meshes: {
      opacity: new AtomicState(0.5, {
        id: 'overlay/meshes/opacity',
        guard: isNumber,
      }),
      brightness: new AtomicState(0.5, {
        id: 'overlay/meshes/brightness',
        guard: isNumber,
      }),
      thickness: new AtomicState(0.5, {
        id: 'overlay/meshes/thickness',
        guard: isNumber,
      }),
    },
  },
  progress: {
    /**
     * A text describing the current step of the node allocation.
     */
    allocation: new AtomicState<string | null>(null),
    /**
     * Number of meshes currently loading in parallel.
     */
    loadingMeshes: new AtomicState(0),
    /**
     * `true` if Brayns is currently loading a SONATA file.
     */
    loadingMorphologies: new AtomicState(false),
  },
});
