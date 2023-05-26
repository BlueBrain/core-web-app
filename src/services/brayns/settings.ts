import { CameraParams } from './types';

const Settings = {
  UNICORE_URL: 'https://unicore.bbp.epfl.ch:8080/BB5-CSCS/rest/core',
  UNICORE_ACCOUNT: 'proj134',
  UNICORE_PARTITION: 'prod',
  UNICORE_MEMORY: '96G',
  BRAYNS_BACKEND_PORT: 8000,
  BRAYNS_RENDERER_PORT: 5000,
  NODE_COUNT_LIMIT: 10000,
  /**
   * Initial settings for the camera.
   */
  CAMERA: {
    target: [6587.5015, 3849.2866, 5687.4893],
    distance: 10000,
    orientation: [0.707107, 0.0, -0.707107, 0],
  } as CameraParams,
};

export default Settings;
