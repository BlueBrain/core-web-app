export type CameraType = 'orthographic' | 'perspective';

export type ExpDesignerCameraType = 'movieCamera' | 'overviewCamera';

interface CameraConfig {
  position: [number, number, number];
  up: [number, number, number];
  lookAt: [number, number, number];
  type: CameraType;
}

interface PerspectiveCameraConfig extends CameraConfig {
  far: number;
}

interface Size {
  width: number;
  height: number;
}

export interface MovieCameraConfig extends CameraConfig {
  resolution: Size; // Final movie resolution (pixels)
  projection: Size; // Projection size (real world)
  rotation: [number, number, number]; // Camera rotation vector
}

export interface ExpDesignerVisualizationConfig {
  activeCamera: ExpDesignerCameraType;
  overviewCamera: PerspectiveCameraConfig;
  movieCamera: MovieCameraConfig;
}
