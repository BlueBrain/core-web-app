import { atom, useAtom, useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { SetStateAction, useMemo } from 'react';

export type MeshType = {
  contentURL: string;
  color: string;
  isLoading: boolean;
  hasError: boolean;
};

export type PointCloudType = {
  regionID: string;
  color: string;
  isLoading: boolean;
  hasError: boolean;
};

export type NodeSetType = {
  nodeSetName: string;
  color: string;
  isLoading: boolean;
  hasError: boolean;
};

export type AtlasVisualizationType = {
  visibleMeshes: MeshType[];
  visiblePointClouds: PointCloudType[];
  visibleNodeSets: NodeSetType[];
};

function isMeshType(obj: MeshType | PointCloudType | NodeSetType): obj is MeshType {
  const data = obj as Record<string, unknown>;
  return typeof data.contentURL === 'string';
}

function isPointCloudType(obj: MeshType | PointCloudType | NodeSetType): obj is PointCloudType {
  return Object.hasOwn(obj, 'regionID');
}

function isNodeSetType(obj: MeshType | PointCloudType | NodeSetType): obj is NodeSetType {
  return Object.hasOwn(obj, 'nodeSetName');
}

const defaultCollection: AtlasVisualizationType = {
  visibleMeshes: [
    {
      contentURL:
        'https://bbp.epfl.ch/nexus/v1/files/bbp/atlas/00d2c212-fa1d-4f85-bd40-0bc217807f5b',
      color: '#FFF',
      isLoading: false,
      hasError: false,
    },
  ],
  visiblePointClouds: [],
  visibleNodeSets: [],
};

export const atlasVisualizationAtom = atom<AtlasVisualizationType>(defaultCollection);

const visibleMeshesAtom = selectAtom(
  atlasVisualizationAtom,
  (atlas) => atlas.visibleMeshes,
  (a: MeshType[], b: MeshType[]) =>
    a.map((item) => item.contentURL).join('\n') === b.map((item) => item.contentURL).join('\n')
);

let atlasVisualizationManager: null | AtlasVisualizationManager = null;

export function useVisibleMeshes(): MeshType[] {
  return useAtomValue(visibleMeshesAtom);
}

type SetAtom<Args extends any[], Result> = (...args: Args) => Result;

type AtlasValueSetter = SetAtom<[SetStateAction<AtlasVisualizationType>], void>;

export class AtlasVisualizationManager {
  private atlasValue: AtlasVisualizationType;

  private setAtlasValue: AtlasValueSetter;

  constructor(atlas: AtlasVisualizationType, setAtlas: AtlasValueSetter) {
    this.atlasValue = atlas;
    this.setAtlasValue = setAtlas;
  }

  get visibleMeshes() {
    return this.atlasValue.visibleMeshes;
  }

  get visiblePointClouds() {
    return this.atlasValue.visiblePointClouds;
  }

  get visibleNodeSets() {
    return this.atlasValue.visibleNodeSets;
  }

  updateAtlasValue(value: AtlasVisualizationType, setAtlasVisualization: AtlasValueSetter) {
    this.atlasValue = value;
    this.setAtlasValue = setAtlasVisualization;
  }

  /**
   * Add `meshes` and/or `pointClouds` to the list of visible ones, unless there is
   * already a mesh/pointCloud with that `contentURL`/`regionId`.
   */
  addVisibleObjects(...objectsToAdd: Array<MeshType | PointCloudType | NodeSetType>): void {
    this.setAtlasValue((currentAtlasValue: AtlasVisualizationType) => {
      let visibleMeshes = [...currentAtlasValue.visibleMeshes];
      let visiblePointClouds = [...currentAtlasValue.visiblePointClouds];
      let visibleNodeSets = [...currentAtlasValue.visibleNodeSets];

      objectsToAdd.forEach((obj) => {
        if (isMeshType(obj)) {
          if (!currentAtlasValue.visibleMeshes.find((mesh) => mesh.contentURL === obj.contentURL)) {
            visibleMeshes = [...visibleMeshes, { ...obj }];
          }
        } else if (
          isPointCloudType(obj) &&
          !currentAtlasValue.visiblePointClouds.find(
            (pointCloud) => pointCloud.regionID === obj.regionID
          )
        ) {
          visiblePointClouds = [...visiblePointClouds, { ...obj }];
        } else if (
          isNodeSetType(obj) &&
          !currentAtlasValue.visibleNodeSets.find(
            (nodeSet) => nodeSet.nodeSetName === obj.nodeSetName
          )
        ) {
          visibleNodeSets = [...visibleNodeSets, { ...obj }];
        }
      });

      return {
        visibleMeshes,
        visiblePointClouds,
        visibleNodeSets,
      };
    });
  }

  /**
   * Remove the meshes/pointClouds with the given `ids`.
   * If such mesh exists, the state will be updated.
   */
  removeVisibleObjects(...ids: string[]): void {
    this.setAtlasValue((currentAtlasValue) => {
      let newVisibleMeshes = [...currentAtlasValue.visibleMeshes];
      let newVisiblePointClouds = [...currentAtlasValue.visiblePointClouds];
      let newVisibleNodeSets = [...currentAtlasValue.visibleNodeSets];

      ids.forEach((id) => {
        newVisibleMeshes = newVisibleMeshes.filter((mesh) => mesh.contentURL !== id);
        newVisiblePointClouds = newVisiblePointClouds.filter(
          (pointCloud) => pointCloud.regionID !== id
        );
        newVisibleNodeSets = newVisibleNodeSets.filter((nodeSet) => nodeSet.nodeSetName !== id);
      });

      return {
        ...currentAtlasValue,
        visibleMeshes: newVisibleMeshes,
        visiblePointClouds: newVisiblePointClouds,
        visibleNodeSets: newVisibleNodeSets,
      };
    });
  }

  removeAllNodeSetMeshes() {
    this.setAtlasValue((currentAtlasValue) => ({
      ...currentAtlasValue,
      visibleNodeSets: [],
    }));
  }

  /**
   * @returns A mesh with `contentURL` or `undefined`.
   */
  findVisibleMesh(contentURL: string): MeshType | undefined {
    return this.atlasValue.visibleMeshes.find((mesh) => mesh.contentURL === contentURL);
  }

  /**
   * Update the mesh with the given `contentURL`.
   * If such mesh exists, the state will be updated.
   * @returns `true` is such mesh has been found and updated.
   */
  updateVisibleMesh(update: Partial<MeshType> & { contentURL: string }) {
    const mesh = this.findVisibleMesh(update.contentURL);
    if (!mesh) return false;

    this.setAtlasValue((currentAtlasValue) => ({
      ...currentAtlasValue,
      visibleMeshes: [
        { ...mesh, ...update },
        ...currentAtlasValue.visibleMeshes.filter(
          ({ contentURL }) => contentURL !== update.contentURL
        ),
      ],
    }));

    return true;
  }

  /**
   * @returns A PointCloud with `regionID` or `undefined`.
   */
  findVisiblePointCloud(regionID: string): PointCloudType | undefined {
    return this.atlasValue.visiblePointClouds.find(
      (pointCloud) => pointCloud.regionID === regionID
    );
  }

  /**
   * @returns A NodeSet with `nodeSetName` or `undefined`.
   */
  findVisibleNodeSet(nodeSetName: string): NodeSetType | undefined {
    return this.atlasValue.visibleNodeSets.find((nodeSet) => nodeSet.nodeSetName === nodeSetName);
  }

  /**
   * Update the pointCloud with the given `regionID`.
   * If such pointCloud exists, the state will be updated.
   * @returns `true` is such pointCloud has been found and updated.
   */
  updateVisiblePointCloud(update: Partial<PointCloudType> & { regionID: string }) {
    const pointCloud = this.findVisiblePointCloud(update.regionID);
    if (!pointCloud) return false;

    this.setAtlasValue((currentAtlasValue) => ({
      ...currentAtlasValue,
      visiblePointClouds: [
        { ...pointCloud, ...update },
        ...currentAtlasValue.visiblePointClouds.filter(
          ({ regionID }) => regionID !== update.regionID
        ),
      ],
    }));

    return true;
  }

  /**
   * Update the nodeSet with the given `nodeSetName`.
   * If such nodeSet exists, the state will be updated.
   * @returns `true` is such nodeSet has been found and updated.
   */
  updateVisibleNodeSets(update: Partial<NodeSetType> & { nodeSetName: string }) {
    const nodeSet = this.findVisibleNodeSet(update.nodeSetName);
    if (!nodeSet) {
      return false;
    }

    this.setAtlasValue((currentAtlasValue) => ({
      ...currentAtlasValue,
      visibleNodeSets: [
        { ...nodeSet, ...update },
        ...currentAtlasValue.visibleNodeSets.filter(
          ({ nodeSetName }) => nodeSetName !== update.nodeSetName
        ),
      ],
    }));

    return true;
  }
}

export function useAtlasVisualizationManager() {
  const [atlasVisualization, setAtlasVisualization] = useAtom(atlasVisualizationAtom);
  return useMemo(() => {
    if (!atlasVisualizationManager)
      atlasVisualizationManager = new AtlasVisualizationManager(
        atlasVisualization,
        setAtlasVisualization
      );
    else {
      atlasVisualizationManager.updateAtlasValue(atlasVisualization, setAtlasVisualization);
    }
    return atlasVisualizationManager;
  }, [atlasVisualization, setAtlasVisualization]);
}
