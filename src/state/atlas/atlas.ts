import { atom, useAtom, useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { SetStateAction, useMemo } from 'react';
import sessionAtom from '@/state/session';
import { meshDistributionsAtom } from '@/state/brain-regions';

interface AtlasItemType {
  type: 'mesh' | 'pointCloud' | 'nodeSet' | 'cell';
  color: string;
  isLoading: boolean;
  hasError: boolean;
}

export interface MeshType extends AtlasItemType {
  type: 'mesh';
  contentURL: string;
}

export interface PointCloudType extends AtlasItemType {
  type: 'pointCloud';
  regionID: string;
}

export interface NodeSetType extends AtlasItemType {
  type: 'nodeSet';
  nodeSetName: string;
}

export interface CellType extends AtlasItemType {
  type: 'cell';
  regionID: string;
}

export type AtlasVisualizationType = {
  visibleMeshes: MeshType[];
  visiblePointClouds: PointCloudType[];
  visibleNodeSets: NodeSetType[];
  visibleCells: CellType[];
};

function isMeshType(obj: AtlasItemType): obj is MeshType {
  return obj.type === 'mesh';
}

function isPointCloudType(obj: AtlasItemType): obj is PointCloudType {
  return obj.type === 'pointCloud';
}

function isNodeSetType(obj: AtlasItemType): obj is NodeSetType {
  return obj.type === 'nodeSet';
}

function isCellType(obj: AtlasItemType): obj is CellType {
  return obj.type === 'cell';
}

const defaultCollection: AtlasVisualizationType = {
  visibleMeshes: [],
  visiblePointClouds: [],
  visibleNodeSets: [],
  visibleCells: [],
};

/**
 * Atom that initializes the atlas visualization by retrieving the mesh distributions
 * and setting up the root mesh
 */
export const initializeRootMeshAtom = atom(null, async (get, set) => {
  const session = get(sessionAtom);
  if (!session) return;
  const meshes = await get(meshDistributionsAtom);
  // By convention the root brain region has id = 997
  const rootMeshContentUrl = meshes?.[997].contentUrl;

  if (rootMeshContentUrl) {
    const atlasVizualization = get(atlasVisualizationAtom);

    atlasVizualization.visibleMeshes.push({
      type: 'mesh',
      contentURL: rootMeshContentUrl,
      color: '#FFF',
      isLoading: false,
      hasError: false,
    });
    set(atlasVisualizationAtom, { ...atlasVizualization });
  }
});

export const atlasVisualizationAtom = atom(defaultCollection);

export const resetAtlasVisualizationAtom = atom(null, (get, set) =>
  set(atlasVisualizationAtom, defaultCollection)
);

// Singleton.
let atlasVisualizationManager: null | AtlasVisualizationManager = null;

const visibleMeshesAtom = selectAtom(
  atlasVisualizationAtom,
  (atlas) => atlas.visibleMeshes,
  (a: MeshType[], b: MeshType[]) =>
    a.map((item) => item.contentURL).join('\n') === b.map((item) => item.contentURL).join('\n')
);

export function useVisibleMeshes(): MeshType[] {
  return useAtomValue(visibleMeshesAtom);
}

const visibleCellsAtom = selectAtom(
  atlasVisualizationAtom,
  (atlas) => atlas.visibleCells,
  (a: CellType[], b: CellType[]) =>
    a.map((item) => item.regionID).join('\n') === b.map((item) => item.regionID).join('\n')
);

export function useVisibleCells(): CellType[] {
  return useAtomValue(visibleCellsAtom);
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

  get visibleCells() {
    return this.atlasValue.visibleCells;
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
  addVisibleObjects(
    ...objectsToAdd: Array<MeshType | PointCloudType | NodeSetType | CellType>
  ): void {
    this.setAtlasValue((currentAtlasValue: AtlasVisualizationType) => {
      let visibleMeshes = [...currentAtlasValue.visibleMeshes];
      let visiblePointClouds = [...currentAtlasValue.visiblePointClouds];
      let visibleNodeSets = [...currentAtlasValue.visibleNodeSets];
      let visibleCells = [...currentAtlasValue.visibleCells];

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
        } else if (
          isCellType(obj) &&
          !currentAtlasValue.visibleCells.find((cell) => cell.regionID === obj.regionID)
        ) {
          visibleCells = [...visibleCells, { ...obj }];
        }
      });

      return {
        visibleMeshes,
        visiblePointClouds,
        visibleNodeSets,
        visibleCells,
      };
    });
  }

  /**
   * Remove the meshes/pointClouds with the given `ids`.
   * If such mesh exists, the state will be updated.
   */
  removeVisibleMeshesOrPointClouds(...ids: string[]): void {
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

  removeVisibleCells(...regionIDs: string[]): void {
    this.setAtlasValue((currentAtlasValue) => {
      const regionSet = new Set(regionIDs);
      return {
        ...currentAtlasValue,
        visibleCells: currentAtlasValue.visibleCells.filter(
          (cell) => !regionSet.has(cell.regionID)
        ),
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
   * Update the mesh with the given `regionID`.
   * If such mesh exists, the state will be updated.
   * @returns `true` is such mesh has been found and updated.
   */
  updateVisibleCell(update: Partial<CellType> & { regionID: string }) {
    const cell = this.findVisibleCell(update.regionID);
    if (!cell) return false;

    this.setAtlasValue((currentAtlasValue) => ({
      ...currentAtlasValue,
      visibleCells: [
        { ...cell, ...update },
        ...currentAtlasValue.visibleCells.filter(({ regionID }) => regionID !== update.regionID),
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
   * @returns A Cell with `regionID` or `undefined`.
   */
  findVisibleCell(regionID: string): CellType | undefined {
    return this.atlasValue.visibleCells.find((cell) => cell.regionID === regionID);
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
