import { atom } from 'jotai';

type MeshType = {
  contentURL: string;
  color: string;
  isLoading: boolean;
};

type AtlasVisualizationType = {
  visibleMeshes: MeshType[];
};

const defaultCollection = {
  visibleMeshes: [
    {
      contentURL:
        'https://bbp.epfl.ch/nexus/v1/files/bbp/atlas/00d2c212-fa1d-4f85-bd40-0bc217807f5b',
      color: '#FFF',
      isLoading: false,
    },
  ],
};

const AtlasVisualizationAtom = atom<AtlasVisualizationType>(defaultCollection);

export default AtlasVisualizationAtom;
