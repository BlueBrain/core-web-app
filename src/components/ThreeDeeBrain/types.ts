export type Point = {
  id: number;
  mtype: string;
  region: string;
  x: number;
  y: number;
  z: number;
};

export type VisibilityType = 'mesh' | 'pointCloud';

export type MeshVisibility = {
  type: VisibilityType;
  brainRegionId: string;
  sceneId: string;
};

export type LoadingState = {
  id: string;
  type: VisibilityType;
};
