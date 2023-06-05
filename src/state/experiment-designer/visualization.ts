import { atom } from 'jotai';
import { ExpDesignerVisualizationConfig } from '@/types/experiment-designer-visualization';

export const DEFAULT_OVERVIEW_CAMERA_POSITION: [number, number, number] = [
  -17970.783508199806, -17086.701412939885, -19588.70241470358,
];

export const DEFAULT_MOVIE_CAMERA_POSITION: [number, number, number] = [
  -17970.783508199806, -17086.701412939885, -19588.70241470358,
];

export const DEFAULT_CAMERA_LOOK_AT: [number, number, number] = [6612.504, 3938.164, 5712.791];

const DEFAULT_MOVIE_PROJECTION_MULTIPLIER = 8;

export const cameraConfigAtom = atom<ExpDesignerVisualizationConfig>({
  activeCamera: 'overviewCamera',
  overviewCamera: {
    type: 'perspective',
    position: [...DEFAULT_OVERVIEW_CAMERA_POSITION],
    lookAt: [...DEFAULT_CAMERA_LOOK_AT],
    up: [0, 0, 0],
    far: 1000000,
  },
  movieCamera: {
    type: 'orthographic',
    position: [...DEFAULT_MOVIE_CAMERA_POSITION],
    up: [0, 0, 0],
    lookAt: [...DEFAULT_CAMERA_LOOK_AT],
    projection: {
      width: 1920 * DEFAULT_MOVIE_PROJECTION_MULTIPLIER,
      height: 1080 * DEFAULT_MOVIE_PROJECTION_MULTIPLIER,
    },
    resolution: { width: 1920, height: 1080 },
  },
} as ExpDesignerVisualizationConfig);
