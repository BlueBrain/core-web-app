import { AtlasVisualizationManager } from './atlas';

class FakeManager extends AtlasVisualizationManager {
  private _triggerCount = 0;

  constructor() {
    super(
      {
        visibleMeshes: [],
        visiblePointClouds: [],
        visibleNodeSets: [],
      },
      () => {
        this._triggerCount += 1;
      }
    );
  }

  get triggerCount() {
    return this._triggerCount;
  }
}

describe(`AtlasVisualizationManager`, () => {
  describe(`.addVisibleObjects()`, () => {
    describe(`Add mesh`, () => {
      const atlas = new FakeManager();
      atlas.addVisibleObjects({
        contentURL: 'Mesh1',
        color: '#fff',
        hasError: false,
        isLoading: false,
      });
      it(`should add meshes`, () => {
        expect(atlas.visibleMeshes).toEqual([
          {
            contentURL: 'Mesh1',
            color: '#fff',
            hasError: false,
            isLoading: false,
          },
        ]);
      });
      it(`should trigger when adding meshes`, () => {
        expect(atlas.triggerCount).toBe(1);
      });
    });
    describe(`Add cloud`, () => {
      const atlas = new FakeManager();
      atlas.addVisibleObjects({
        regionID: 'Cloud1',
        color: '#fff',
        hasError: false,
        isLoading: false,
      });
      it(`should add pointClouds`, () => {
        expect(atlas.visiblePointClouds.length).toBe(1);
      });
      it(`should trigger when adding pointClouds`, () => {
        expect(atlas.triggerCount).toBe(1);
      });
    });
    describe(`Add both`, () => {
      const atlas = new FakeManager();
      atlas.addVisibleObjects(
        {
          contentURL: 'Mesh1',
          color: '#fff',
          hasError: false,
          isLoading: false,
        },
        {
          contentURL: 'Mesh2',
          color: '#fff',
          hasError: false,
          isLoading: false,
        },
        {
          regionID: 'Cloud1',
          color: '#fff',
          hasError: false,
          isLoading: false,
        },
        {
          regionID: 'Cloud2',
          color: '#fff',
          hasError: false,
          isLoading: false,
        }
      );
      it(`should add both mesh and pointCloud`, () => {
        expect(atlas.visibleMeshes).toEqual([
          {
            contentURL: 'Mesh1',
            color: '#fff',
            hasError: false,
            isLoading: false,
          },
          {
            contentURL: 'Mesh2',
            color: '#fff',
            hasError: false,
            isLoading: false,
          },
        ]);
        expect(atlas.visiblePointClouds).toEqual([
          {
            regionID: 'Cloud1',
            color: '#fff',
            hasError: false,
            isLoading: false,
          },
          {
            regionID: 'Cloud2',
            color: '#fff',
            hasError: false,
            isLoading: false,
          },
        ]);
      });
      it(`should trigger when adding both mesh and pointCloud`, () => {
        expect(atlas.triggerCount).toBe(1);
      });
    });
    describe(`Add already existing mesh`, () => {
      const atlas = new FakeManager();
      atlas.addVisibleObjects(
        {
          contentURL: 'Mesh1',
          color: '#fff',
          hasError: false,
          isLoading: false,
        },
        {
          contentURL: 'Mesh2',
          color: '#fff',
          hasError: false,
          isLoading: false,
        },
        {
          regionID: 'Cloud2',
          color: '#fff',
          hasError: false,
          isLoading: false,
        }
      );
      it(`should not add duplicate mesh`, () => {
        atlas.addVisibleObjects({
          contentURL: 'Mesh1',
          color: '#f80',
          hasError: true,
          isLoading: true,
        });
        expect(atlas.visibleMeshes).toEqual([
          {
            contentURL: 'Mesh1',
            color: '#fff',
            hasError: false,
            isLoading: false,
          },
          {
            contentURL: 'Mesh2',
            color: '#fff',
            hasError: false,
            isLoading: false,
          },
        ]);
      });
    });
    describe(`Add already existing cloud`, () => {
      const atlas = new FakeManager();
      atlas.addVisibleObjects(
        {
          contentURL: 'Mesh1',
          color: '#fff',
          hasError: false,
          isLoading: false,
        },
        {
          regionID: 'Cloud1',
          color: '#fff',
          hasError: false,
          isLoading: false,
        },
        {
          regionID: 'Cloud2',
          color: '#fff',
          hasError: false,
          isLoading: false,
        }
      );
      it(`should not add duplicate cloud`, () => {
        atlas.addVisibleObjects({
          regionID: 'Cloud1',
          color: '#f80',
          hasError: true,
          isLoading: true,
        });
        expect(atlas.visiblePointClouds).toEqual([
          {
            regionID: 'Cloud1',
            color: '#fff',
            hasError: false,
            isLoading: false,
          },
          {
            regionID: 'Cloud2',
            color: '#fff',
            hasError: false,
            isLoading: false,
          },
        ]);
      });
    });
  });
  describe(`.removeVisibleObjects`, () => {
    describe(`Remove mesh`, () => {
      const atlas = new FakeManager();
      atlas.addVisibleObjects(
        {
          contentURL: 'Mesh1',
          color: '#fff',
          hasError: false,
          isLoading: false,
        },
        {
          contentURL: 'Mesh2',
          color: '#fff',
          hasError: false,
          isLoading: false,
        },
        {
          regionID: 'Cloud1',
          color: '#fff',
          hasError: false,
          isLoading: false,
        },
        {
          regionID: 'Cloud2',
          color: '#fff',
          hasError: false,
          isLoading: false,
        }
      );
      atlas.removeVisibleObjects('Mesh1');
      expect(atlas.visibleMeshes).toEqual([
        {
          contentURL: 'Mesh2',
          color: '#fff',
          hasError: false,
          isLoading: false,
        },
      ]);
    });
    describe(`Remove cloud`, () => {
      const atlas = new FakeManager();
      atlas.addVisibleObjects(
        {
          contentURL: 'Mesh1',
          color: '#fff',
          hasError: false,
          isLoading: false,
        },
        {
          contentURL: 'Mesh2',
          color: '#fff',
          hasError: false,
          isLoading: false,
        },
        {
          regionID: 'Cloud1',
          color: '#fff',
          hasError: false,
          isLoading: false,
        },
        {
          regionID: 'Cloud2',
          color: '#fff',
          hasError: false,
          isLoading: false,
        }
      );
      atlas.removeVisibleObjects('Cloud1');
      expect(atlas.visiblePointClouds).toEqual([
        {
          regionID: 'Cloud2',
          color: '#fff',
          hasError: false,
          isLoading: false,
        },
      ]);
    });
  });
});
