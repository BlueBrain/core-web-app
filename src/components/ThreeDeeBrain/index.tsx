import { useAtom, useAtomValue } from 'jotai';
import { Suspense, useEffect, useLayoutEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { unwrap, useResetAtom } from 'jotai/utils';
import { Vector3 } from 'three';
import { OrbitControls } from '@react-three/drei';
import { ApplicationSection } from '@/types/common';
import { brainRegionsAtom, visibleBrainRegionsAtom } from '@/state/brain-regions';
import { ROOT_BRAIN_REGION_URI } from '@/constants/brain-hierarchy';
import { BrainRegionMesh } from '@/components/ThreeDeeBrain/BrainRegionMesh';
import { meshVisibilityAtom } from '@/components/ThreeDeeBrain/state';
import { PointCloudMesh } from '@/components/ThreeDeeBrain/PointCloud';
import { sectionAtom } from '@/state/application';
import { LoadingHandler } from '@/components/ThreeDeeBrain/LoadingHandler';

function VisualizationHandler({ section }: { section: ApplicationSection }) {
  const visibleBrainRegions = useAtomValue(visibleBrainRegionsAtom(section));
  const brainRegions = useAtomValue(useMemo(() => unwrap(brainRegionsAtom), []));
  const [meshVisibility, setMeshVisibility] = useAtom(meshVisibilityAtom(section));
  const resetMeshVisibility = useResetAtom(meshVisibilityAtom(section));

  const { scene } = useThree();

  useLayoutEffect(() => {
    return () => {
      // when component unmounts, resetting the mesh visibility since the meshes are not displayed anymore
      resetMeshVisibility();
      scene.clear();
    };
  }, [resetMeshVisibility, scene, section]);

  useEffect(() => {
    // iterating over visualized items. Remove the one that should not be visible
    meshVisibility
      .filter((vis) => {
        return (
          !visibleBrainRegions.includes(vis.brainRegionId) &&
          vis.brainRegionId !== ROOT_BRAIN_REGION_URI
        );
      })
      .forEach((vis) => {
        const sceneObject = scene.children.find((sceneItem) => sceneItem.uuid === vis.sceneId);
        if (sceneObject) {
          scene.remove(sceneObject);
          setMeshVisibility(
            meshVisibility.filter((visualizedItem) => visualizedItem.sceneId !== sceneObject.uuid)
          );
        }
      });
  }, [meshVisibility, scene, section, setMeshVisibility, visibleBrainRegions]);

  if (!brainRegions) return null;

  return (
    <>
      {[...(visibleBrainRegions || []), ROOT_BRAIN_REGION_URI].map((brainRegionId) => {
        const brainRegion = brainRegions.find((br) => br.id === brainRegionId);
        return (
          <Suspense key={brainRegionId}>
            <BrainRegionMesh
              key={`${brainRegionId}--mesh`}
              brainRegionId={brainRegionId}
              section={section}
              color={brainRegion?.colorCode}
            />
            {brainRegionId !== ROOT_BRAIN_REGION_URI && (
              <PointCloudMesh
                key={`${brainRegionId}--pointcloud`}
                brainRegionId={brainRegionId}
                section={section}
                color={brainRegion?.colorCode}
              />
            )}
          </Suspense>
        );
      })}
    </>
  );
}

export default function ThreeDeeBrain() {
  const section = useAtomValue(sectionAtom);
  if (!section) {
    return null;
  }

  return (
    <div className="h-full w-full bg-black">
      <LoadingHandler section={section} />
      <Canvas
        dpr={[1, 2]}
        camera={{
          position: [-14437.479, 4358.573, 5423.8],
          up: [0, -1, 0],
          fov: 55,
          far: 100000,
          type: 'PerspectiveCamera',
        }}
      >
        <OrbitControls target={new Vector3(6612.504, 3938.164, 5712.791)} zoomSpeed={0.3} />
        <Suspense fallback={null}>
          <VisualizationHandler section={section} />
        </Suspense>
      </Canvas>
    </div>
  );
}
