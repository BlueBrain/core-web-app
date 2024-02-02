'use client';

import { Vector3, Euler, Camera } from 'three';
import round from 'lodash/round';
import debounce from 'lodash/debounce';
import findIndex from 'lodash/findIndex';
import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import PreviewMesh from '@/components/experiment-designer/simulation-preview/PreviewMesh';
import {
  cameraConfigAtom,
  DEFAULT_CAMERA_LOOK_AT,
  DEFAULT_MOVIE_CAMERA_LOOK_AT,
  DEFAULT_MOVIE_CAMERA_POSITION,
  DEFAULT_MOVIE_CAMERA_PROJECTION,
  DEFAULT_OVERVIEW_CAMERA_POSITION,
} from '@/state/experiment-designer/visualization';
import {
  ExpDesignerCameraType,
  ExpDesignerVisualizationConfig,
  MovieCameraConfig,
} from '@/types/experiment-designer-visualization';
import { expDesignerConfigAtom } from '@/state/experiment-designer';
import {
  ExpDesignerNumberParameter,
  ExpDesignerPositionParameter,
  TargetList,
} from '@/types/experiment-designer';
import simPreviewThreeCtxWrapper from '@/components/experiment-designer/simulation-preview/SimulationPreview/SimPreviewThreeCtxWrapper';
import CameraSwitch from '@/components/experiment-designer/simulation-preview/SimulationPreview/CameraSwitch';
import ResetViewButton from '@/components/experiment-designer/simulation-preview/SimulationPreview/ResetViewButton';
import ColorLegend from '@/components/experiment-designer/simulation-preview/SimulationPreview/ColorLegend';

interface SimulationPreviewProps {
  targetsToDisplay: TargetList;
}

function getCameraLookAtPosition(camera: Camera, distance: number): Vector3 {
  const cameraPosition = camera.position.clone();
  const cameraRotation = camera.rotation.clone();
  const direction = new Vector3(0, 0, -1);
  direction.applyEuler(cameraRotation);
  direction.normalize().multiplyScalar(distance);

  return new Vector3().addVectors(cameraPosition, direction);
}

function calculateDistance(pointA: Vector3, pointB: Vector3) {
  return pointA.distanceTo(pointB);
}

export default function SimulationPreview({ targetsToDisplay }: SimulationPreviewProps) {
  const [isReady, setIsReady] = useState(false);
  const threeDeeDiv = useRef<HTMLDivElement>(null);
  const [expDesignerConfig, setExpDesignerConfig] = useAtom(expDesignerConfigAtom);
  const [cameraConfig, setCameraConfig] = useAtom(cameraConfigAtom);

  const updateExpDesignerCameraAtom = useCallback(
    (newCameraConfig: MovieCameraConfig) => {
      const cameraPositionIndex = findIndex(expDesignerConfig.imaging, { id: 'cameraPos' });
      const imaging = [...expDesignerConfig.imaging];

      imaging[cameraPositionIndex] = {
        ...(imaging[cameraPositionIndex] as ExpDesignerPositionParameter),
        value: newCameraConfig.position,
      };

      const viewportHeightIndex = findIndex(expDesignerConfig.imaging, { id: 'viewportHeight' });
      imaging[viewportHeightIndex] = {
        ...(imaging[viewportHeightIndex] as ExpDesignerNumberParameter),
        value: newCameraConfig.projection.height,
      };

      const cameraTargetIndex = findIndex(expDesignerConfig.imaging, { id: 'cameraTarget' });
      imaging[cameraTargetIndex] = {
        ...(imaging[cameraTargetIndex] as ExpDesignerPositionParameter),
        value: newCameraConfig.lookAt,
      };

      const cameraUpVector = new Vector3(...newCameraConfig.up).applyEuler(
        new Euler(...newCameraConfig.rotation)
      );
      const cameraUpIndex = findIndex(expDesignerConfig.imaging, { id: 'cameraUp' });
      imaging[cameraUpIndex] = {
        ...(imaging[cameraUpIndex] as ExpDesignerPositionParameter),
        value: [cameraUpVector.x, -cameraUpVector.y, cameraUpVector.z],
      };

      const newExpDesignerConfig = { ...expDesignerConfig, imaging };
      setExpDesignerConfig(newExpDesignerConfig);
    },
    [expDesignerConfig, setExpDesignerConfig]
  );

  const handleCameraControlsChange = useCallback(
    (target: any) => {
      if (!simPreviewThreeCtxWrapper.threeContext) {
        return;
      }

      const cameraObject = target.object;
      const activeCameraKey = cameraConfig.activeCamera;
      const { x, y, z } = cameraObject.position;

      const oldPosition = cameraConfig[activeCameraKey].position;
      const newPosition = [round(x, 8), round(y, 8), round(z, 8)] as [number, number, number];

      const newViewportHeight =
        (Math.abs(cameraObject.top) + Math.abs(cameraObject.bottom)) / cameraObject.zoom;
      const newConfig = { ...cameraConfig[activeCameraKey], position: newPosition };
      const aspect = 16 / 9;

      if (activeCameraKey === 'movieCamera') {
        (newConfig as MovieCameraConfig).projection = {
          height: newViewportHeight,
          width: newViewportHeight * aspect,
        };
        (newConfig as MovieCameraConfig).up = cameraObject.up;
        const cameraDistanceToCenter = calculateDistance(
          new Vector3(...newPosition),
          new Vector3(...DEFAULT_MOVIE_CAMERA_LOOK_AT)
        );
        const lookAt = getCameraLookAtPosition(cameraObject, cameraDistanceToCenter);
        (newConfig as MovieCameraConfig).lookAt = [lookAt.x, lookAt.y, lookAt.z];

        const cameraUpVector = new Vector3(0, -1, 0);
        (newConfig as MovieCameraConfig).up = [
          cameraUpVector.x,
          cameraUpVector.y,
          cameraUpVector.z,
        ];

        const cameraRotation = cameraObject.rotation as Euler;
        (newConfig as MovieCameraConfig).rotation = [
          cameraRotation.x,
          cameraRotation.y,
          cameraRotation.z,
        ];
      }

      if (!isEqual(newPosition, oldPosition) || cameraObject.zoom !== 1) {
        simPreviewThreeCtxWrapper.threeContext.needRender = true;

        setCameraConfig({
          ...cameraConfig,
          [activeCameraKey]: newConfig,
        });

        if (activeCameraKey === 'movieCamera') {
          updateExpDesignerCameraAtom(newConfig as MovieCameraConfig);
        }
      }
    },
    [cameraConfig, setCameraConfig, updateExpDesignerCameraAtom]
  );

  const controlsChangeDebounced = useMemo(
    () => debounce(handleCameraControlsChange, 500),
    [handleCameraControlsChange]
  );

  useEffect(() => {
    if (threeDeeDiv.current) {
      simPreviewThreeCtxWrapper.init({
        targetDiv: threeDeeDiv.current,
        cameraPositionXYZ: cameraConfig[cameraConfig.activeCamera].position,
        cameraLookAtXYZ: cameraConfig[cameraConfig.activeCamera].lookAt,
        movieCameraHeight: cameraConfig.movieCamera.projection.height,
        movieCameraUp: cameraConfig.movieCamera.up,
        movieCameraLookAtXYZ: cameraConfig.movieCamera.lookAt,
      });
      setIsReady(true);

      simPreviewThreeCtxWrapper.threeContext?.setControlsChangeCallback(controlsChangeDebounced);

      simPreviewThreeCtxWrapper.drawCameraLookAtSymbol();
      if (cameraConfig.activeCamera === 'overviewCamera') {
        simPreviewThreeCtxWrapper.drawCameraSymbol(cameraConfig.movieCamera.position);
      }
    }
  }, [cameraConfig, controlsChangeDebounced]);

  const switchCamera = useCallback(
    (isMovieCameraChecked?: boolean) => {
      let newActiveCamera: ExpDesignerCameraType;
      if (typeof isMovieCameraChecked !== 'undefined') {
        newActiveCamera = isMovieCameraChecked ? 'movieCamera' : 'overviewCamera';
      } else {
        newActiveCamera =
          cameraConfig.activeCamera === 'overviewCamera' ? 'movieCamera' : 'overviewCamera';
      }
      setCameraConfig({ ...cameraConfig, activeCamera: newActiveCamera });
    },
    [cameraConfig, setCameraConfig]
  );

  const defaultCameraPosition = useMemo(
    () =>
      cameraConfig.activeCamera === 'overviewCamera'
        ? DEFAULT_OVERVIEW_CAMERA_POSITION
        : DEFAULT_MOVIE_CAMERA_POSITION,
    [cameraConfig.activeCamera]
  );

  const resetCamera = useCallback(() => {
    const newConfig: ExpDesignerVisualizationConfig = {
      ...cameraConfig,
      [cameraConfig.activeCamera]: {
        ...cameraConfig[cameraConfig.activeCamera],
        position: defaultCameraPosition,
        lookAt: DEFAULT_CAMERA_LOOK_AT,
        ...(cameraConfig.activeCamera === 'movieCamera'
          ? { projection: { ...DEFAULT_MOVIE_CAMERA_PROJECTION } }
          : {}),
      },
    };
    setCameraConfig(newConfig);
  }, [cameraConfig, defaultCameraPosition, setCameraConfig]);

  const isResetViewButtonDisabled = useMemo(
    () => isEqual(cameraConfig[cameraConfig.activeCamera].position, defaultCameraPosition),
    [cameraConfig, defaultCameraPosition]
  );

  const isMovieCameraActive = useMemo(
    () => cameraConfig.activeCamera === 'movieCamera',
    [cameraConfig.activeCamera]
  );

  useEffect(() => {
    simPreviewThreeCtxWrapper.syncWithCameraState(cameraConfig);
  }, [cameraConfig]);

  return (
    <div className="relative flex h-full w-full items-center">
      <div className="flex h-full w-full items-center overflow-hidden" ref={threeDeeDiv} />
      {isReady && <PreviewMesh targetsToDisplay={targetsToDisplay} />}

      <div className="absolute left-0 top-0 px-6 py-5 text-white">
        <CameraSwitch onChange={switchCamera} isChecked={isMovieCameraActive} />
      </div>

      <div className="absolute bottom-0 left-0 px-6 py-5">
        <ColorLegend targetsToDisplay={targetsToDisplay} />
      </div>

      <div className="absolute right-0 top-0 px-6 py-5 text-white">
        <ResetViewButton onResetCamera={resetCamera} isDisabled={isResetViewButtonDisabled} />
      </div>
    </div>
  );
}
