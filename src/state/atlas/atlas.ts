/* eslint-disable @typescript-eslint/no-use-before-define */
import { atom, useAtom } from 'jotai';
import React from 'react';

type MeshType = {
  contentURL: string;
  color: string;
  isLoading: boolean;
  hasError: boolean;
};

type PointCloudType = {
  regionID: string;
  color: string;
  isLoading: boolean;
  hasError: boolean;
};

type AtlasVisualizationType = {
  visibleMeshes: MeshType[];
  visiblePointClouds: PointCloudType[];
};

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
};

const AtlasVisualizationAtom = atom<AtlasVisualizationType>(defaultCollection);

let atlasVisualizationManager: null | AtlasVisualizationManager = null;

export function useAtlasVisualizationManager() {
  const [atlas, setAtlas] = useAtom(AtlasVisualizationAtom);
  return React.useMemo(() => {
    if (!atlasVisualizationManager)
      atlasVisualizationManager = new AtlasVisualizationManager(atlas, setAtlas);
    return atlasVisualizationManager;
  }, [atlas, setAtlas]);
}

export class AtlasVisualizationManager {
  private _visibleMeshes: MeshType[];

  private _visiblePointClouds: PointCloudType[];

  private readonly trigger: () => void;

  constructor(atlas: AtlasVisualizationType, setAtlas: (atlas: AtlasVisualizationType) => void) {
    this._visibleMeshes = atlas.visibleMeshes;
    this._visiblePointClouds = atlas.visiblePointClouds;
    this.trigger = () => {
      const newAtlas = {
        visibleMeshes: this.visibleMeshes,
        visiblePointClouds: this.visiblePointClouds,
      };
      setAtlas(newAtlas);
    };
  }

  get visibleMeshes() {
    return [...this._visibleMeshes];
  }

  get visiblePointClouds() {
    return [...this._visiblePointClouds];
  }

  /**
   * Add `meshes` and/or `pointClouds` to the list of visible ones, unless there is
   * already a mesh/pointCloud with that `contentURL`/`regionId`.
   */
  addVisibleObjects(...objects: Array<MeshType | PointCloudType>): void {
    let visibleMeshes = this._visibleMeshes;
    let visiblePointClouds = this._visiblePointClouds;
    objects.forEach((obj) => {
      if (isMeshType(obj)) {
        if (!visibleMeshes.find((mesh) => mesh.contentURL === obj.contentURL)) {
          visibleMeshes = [...visibleMeshes, { ...obj }];
        }
      } else if (!visiblePointClouds.find((pointCloud) => pointCloud.regionID === obj.regionID)) {
        visiblePointClouds = [...visiblePointClouds, { ...obj }];
      }
    });
    if (visibleMeshes !== this._visibleMeshes || visiblePointClouds !== this._visiblePointClouds) {
      this._visibleMeshes = visibleMeshes;
      this._visiblePointClouds = visiblePointClouds;
      this.trigger();
    }
  }

  /**
   * Remove the meshes/pointClouds with the given `ids`.
   * If such mesh exists, the state will be updated.
   */
  removeVisibleObjects(...ids: string[]): void {
    let visibleMeshes = this._visibleMeshes;
    let visiblePointClouds = this._visiblePointClouds;
    ids.forEach((id) => {
      const newVisibleMeshes = visibleMeshes.filter((mesh) => mesh.contentURL !== id);
      if (newVisibleMeshes.length < visibleMeshes.length) {
        visibleMeshes = newVisibleMeshes;
        return;
      }
      const newVisiblePointClouds = visiblePointClouds.filter(
        (pointCloud) => pointCloud.regionID !== id
      );
      if (newVisiblePointClouds.length < visiblePointClouds.length) {
        visiblePointClouds = newVisiblePointClouds;
      }
    });
    if (visibleMeshes !== this._visibleMeshes || visiblePointClouds !== this._visiblePointClouds) {
      this._visibleMeshes = visibleMeshes;
      this._visiblePointClouds = visiblePointClouds;
      this.trigger();
    }
  }

  /**
   * @returns A mesh with `contentURL` or `undefined`.
   */
  findVisibleMesh(contentURL: string): MeshType | undefined {
    return this._visibleMeshes.find((mesh) => mesh.contentURL === contentURL);
  }

  /**
   * Remove all the meshes, and update the state if there was at
   * least one mesh to remove.
   * @returns `true` if the list was not empty before the call.
   */
  clearVisibleMeshes() {
    if (this._visibleMeshes.length === 0) return false;

    this._visibleMeshes = [];
    this.trigger();
    return true;
  }

  /**
   * Update the mesh with the given `contentURL`.
   * If such mesh exists, the state will be updated.
   * @returns `true` is such mesh has been found and updated.
   */
  updateVisibleMesh(update: Partial<MeshType> & { contentURL: string }) {
    const mesh = this.findVisibleMesh(update.contentURL);
    if (!mesh) return false;

    this._visibleMeshes = [
      { ...mesh, ...update },
      ...this._visibleMeshes.filter(({ contentURL }) => contentURL !== update.contentURL),
    ];
    this.trigger();
    return true;
  }

  /**
   * Update each mesh of the list with the given attributes.
   * Can be usefull to set `isLoading: false` to every mesh.
   * @returns `true` if the list was not empty.
   */
  updateAllVisibleMeshes(update: Omit<Partial<MeshType>, 'contentURL'>) {
    if (this.visibleMeshes.length === 0) return false;

    this._visibleMeshes = this._visibleMeshes.map((mesh) => ({ ...mesh, ...update }));
    this.trigger();
    return true;
  }

  /**
   * @returns A PointCloud with `regionID` or `undefined`.
   */
  findVisiblePointCloud(regionID: string): PointCloudType | undefined {
    return this._visiblePointClouds.find((pointCloud) => pointCloud.regionID === regionID);
  }

  /**
   * Remove all the pointCloudes, and update the state if there was at
   * least one pointCloud to remove.
   * @returns `true` if the list was not empty before the call.
   */
  clearVisiblePointCloudes() {
    if (this.visiblePointClouds.length === 0) return false;

    this._visiblePointClouds = [];
    this.trigger();
    return true;
  }

  /**
   * Update the pointCloud with the given `regionID`.
   * If such pointCloud exists, the state will be updated.
   * @returns `true` is such pointCloud has been found and updated.
   */
  updateVisiblePointCloud(update: Partial<PointCloudType> & { regionID: string }) {
    const pointCloud = this.findVisiblePointCloud(update.regionID);
    if (!pointCloud) return false;

    this._visiblePointClouds = [
      { ...pointCloud, ...update },
      ...this._visiblePointClouds.filter(({ regionID }) => regionID !== update.regionID),
    ];
    this.trigger();
    return true;
  }

  /**
   * Update each pointCloud of the list with the given attributes.
   * Can be usefull to set `isLoading: false` to every mesh.
   * @returns `true` if the list was not empty.
   */
  updateAllVisiblePointClouds(update: Omit<Partial<PointCloudType>, 'regionID'>) {
    if (this.visiblePointClouds.length === 0) return false;

    this._visiblePointClouds = this.visiblePointClouds.map((pointCloud) => ({
      ...pointCloud,
      ...update,
    }));
    this.trigger();
    return true;
  }
}

function isMeshType(obj: MeshType | PointCloudType): obj is MeshType {
  const data = obj as Record<string, unknown>;
  return typeof data.contentURL === 'string';
}
