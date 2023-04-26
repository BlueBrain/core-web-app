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

export interface ExpDesignerVisualizationConfig {
  activeCamera: ExpDesignerCameraType;
  overviewCamera: PerspectiveCameraConfig;
  movieCamera: CameraConfig;
}
