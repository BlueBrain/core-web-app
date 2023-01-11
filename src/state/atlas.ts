import { atom } from 'jotai/vanilla';

type MeshType = {
  contentURL: string;
  color: string;
  isLoading: boolean;
};

type PointCloudType = {
  regionID: string;
  color: string;
  isLoading: boolean;
};

type AtlasVisualizationType = {
  visibleMeshes: MeshType[];
  visiblePointClouds: PointCloudType[];
};

const defaultCollection = {
  visibleMeshes: [
    {
      contentURL:
        'https://bbp.epfl.ch/nexus/v1/files/bbp/atlas/00d2c212-fa1d-4f85-bd40-0bc217807f5b',
      color: '#FFF',
      isLoading: true,
    },
  ],
  visiblePointClouds: [],
};

const AtlasVisualizationAtom = atom<AtlasVisualizationType>(defaultCollection);

export default AtlasVisualizationAtom;
