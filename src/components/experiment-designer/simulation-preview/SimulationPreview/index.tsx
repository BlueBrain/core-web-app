'use client';

/* eslint-disable lodash/import-scope */

import * as THREE from 'three';
import { findIndex, isEqual } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'antd';
import { useAtom } from 'jotai';
import PreviewMesh from '@/components/experiment-designer/simulation-preview/PreviewMesh';
import {
  cameraConfigAtom,
  DEFAULT_CAMERA_LOOK_AT,
  DEFAULT_OVERVIEW_CAMERA_POSITION,
  DEFAULT_MOVIE_CAMERA_POSITION,
} from '@/state/experiment-designer/visualization';
import { ExpDesignerCameraType } from '@/types/experiment-designer-visualization';
import { expDesignerConfigAtom } from '@/state/experiment-designer';
import { ExpDesignerPositionParameter } from '@/types/experiment-designer';
import { EyeIcon } from '@/components/icons';
import simPreviewThreeCtxWrapper from '@/components/experiment-designer/simulation-preview/SimulationPreview/SimPreviewThreeCtxWrapper';

export default function SimulationPreview() {
  const [ready, isReady] = useState(false);
  const threeDeeDiv = useRef<HTMLDivElement>(null);

  const [expDesignerConfig, setExpDesignerConfig] = useAtom(expDesignerConfigAtom);
  const [cameraConfig, setCameraConfig] = useAtom(cameraConfigAtom);

  const updateCameraAtom = useCallback(
    (newPosition: [number, number, number]) => {
      const cameraPosIndex = findIndex(expDesignerConfig.imaging, { id: 'cameraPos' });
      const newImagingSection = [...expDesignerConfig.imaging];
      newImagingSection[cameraPosIndex] = {
        ...(newImagingSection[cameraPosIndex] as ExpDesignerPositionParameter),
        value: newPosition,
      };
      const newExpDesignerConfig = { ...expDesignerConfig, imaging: newImagingSection };
      console.debug('newImagingSection', {
        newImagingSection,
        cameraPosIndex,
        newExpDesignerConfig,
      });
      setExpDesignerConfig(newExpDesignerConfig);
    },
    [expDesignerConfig, setExpDesignerConfig]
  );

  useEffect(() => {
    const handleCameraChange = (event: THREE.Event) => {
      if (!simPreviewThreeCtxWrapper.threeContext) {
        return;
      }
      simPreviewThreeCtxWrapper.threeContext.needRender = true;
      const { x, y, z } = event.target.object.position;
      const newPosition = [x, y, z] as [number, number, number];
      const activeCameraKey = cameraConfig.activeCamera;
      setCameraConfig({
        ...cameraConfig,
        [activeCameraKey]: { ...cameraConfig[activeCameraKey], position: newPosition },
      });
      if (activeCameraKey === 'movieCamera') {
        updateCameraAtom(newPosition);
      }
    };

    if (threeDeeDiv.current) {
      simPreviewThreeCtxWrapper.init({
        targetDiv: threeDeeDiv.current,
        cameraPositionXYZ: [...DEFAULT_OVERVIEW_CAMERA_POSITION],
      });
      isReady(true);

      // @ts-ignore
      simPreviewThreeCtxWrapper.threeContext.controls.addEventListener(
        'change',
        handleCameraChange
      );

      simPreviewThreeCtxWrapper.drawCameraLookAtSymbol();
      simPreviewThreeCtxWrapper.drawCameraSymbol(cameraConfig.movieCamera.position);
    }

    return () => {
      // @ts-ignore
      simPreviewThreeCtxWrapper.threeContext.controls.removeEventListener(
        'change',
        handleCameraChange
      );
    };
  }, [cameraConfig, setCameraConfig, threeDeeDiv, updateCameraAtom]);

  const switchCamera = useCallback(() => {
    const newActiveCamera: ExpDesignerCameraType =
      cameraConfig.activeCamera === 'overviewCamera' ? 'movieCamera' : 'overviewCamera';
    const cameraPosition = cameraConfig[newActiveCamera].position;
    setCameraConfig({ ...cameraConfig, activeCamera: newActiveCamera });

    simPreviewThreeCtxWrapper.threeContext?.setCameraPosition(cameraPosition);
    if (newActiveCamera === 'movieCamera') {
      simPreviewThreeCtxWrapper.threeContext?.switchToOrthographicCamera();
    } else {
      simPreviewThreeCtxWrapper.threeContext?.switchToPerspectiveCamera();
      simPreviewThreeCtxWrapper.drawCameraSymbol(cameraConfig.movieCamera.position);
    }
  }, [cameraConfig, setCameraConfig]);

  const defaultCameraPosition = useMemo(
    () =>
      cameraConfig.activeCamera === 'overviewCamera'
        ? DEFAULT_OVERVIEW_CAMERA_POSITION
        : DEFAULT_MOVIE_CAMERA_POSITION,
    [cameraConfig.activeCamera]
  );

  const resetCamera = useCallback(() => {
    const newConfig = {
      ...cameraConfig,
      [cameraConfig.activeCamera]: {
        ...cameraConfig[cameraConfig.activeCamera],
        position: defaultCameraPosition,
        lookAt: DEFAULT_CAMERA_LOOK_AT,
      },
    };
    setCameraConfig(newConfig);
    simPreviewThreeCtxWrapper.threeContext?.setCameraPosition(defaultCameraPosition);
    simPreviewThreeCtxWrapper.threeContext?.lookAt(new THREE.Vector3(...DEFAULT_CAMERA_LOOK_AT));
  }, [cameraConfig, defaultCameraPosition, setCameraConfig]);

  const isResetViewButtonDisabled = useMemo(
    () => isEqual(cameraConfig[cameraConfig.activeCamera].position, defaultCameraPosition),
    [cameraConfig, defaultCameraPosition]
  );

  return (
    <div className="relative w-full h-full flex">
      <div className="flex h-full w-full" ref={threeDeeDiv} />
      {ready && <PreviewMesh />}
      <div className="absolute left-0 top-0 text-white">
        <Button onClick={switchCamera}>Switch camera</Button>
        <Button onClick={resetCamera} disabled={isResetViewButtonDisabled}>
          <div className="flex flex-row align-middle items-center">
            Reset view
            <EyeIcon className="ml-3" />
          </div>
        </Button>
        <div>Active: {cameraConfig.activeCamera}</div>
      </div>
    </div>
  );
}
