/* eslint-disable @typescript-eslint/no-use-before-define */
import { useCallback, useEffect, useRef } from 'react';

import { logError } from '../../../util/logger';
import Painter from './painter';
import Icon from './Icon';
import { CameraTransformInteface } from '@/services/brayns/common/utils/camera-transform';

import styles from './axis-gizmo.module.css';

const GIZMO_SIZE = 128;

export interface AxisGizmoViewProps {
  className?: string;
  camera: CameraTransformInteface;
}

export default function AxisGizmoView({ className, camera }: AxisGizmoViewProps) {
  const refCanvas = useRef<null | HTMLCanvasElement>(null);
  useEffect((): (() => void) | undefined => {
    const canvas = refCanvas.current;
    if (!canvas) return undefined;

    try {
      return initCanvas(canvas, camera);
    } catch (ex) {
      logError('Unable to initialize Canvas for Axis Gizmo:', ex);
      return undefined;
    }
  }, [camera]);
  const rotate = useCallback(
    (direction: number) => {
      camera.rotateAroundZ(-direction * 0.5 * Math.PI);
    },
    [camera]
  );
  return (
    <div className={join(className, styles.AxisGizmo)}>
      <canvas ref={refCanvas} width={GIZMO_SIZE} height={GIZMO_SIZE} />
      <Icon className="icon left" name="turn-left" onClick={() => rotate(+1)} />
      <Icon className="icon right" name="turn-right" onClick={() => rotate(-1)} />
    </div>
  );
}

type Quaternion = [x: number, y: number, z: number, w: number];
const RADIUS = 0.5 * Math.sqrt(2);
const ORIENTATIONS: { [key: string]: Quaternion } = {
  'X+': [RADIUS, 0, RADIUS, 0],
  'X-': [RADIUS, 0, -RADIUS, 0],
  'Y+': [-RADIUS, 0, 0, RADIUS],
  'Y-': [-RADIUS, 0, 0, -RADIUS],
  'Z+': [0, 0, 1, 0],
  'Z-': [1, 0, 0, 0],
};
const BACK: { [name: string]: string } = {
  'X+': 'X-',
  'X-': 'X+',
  'Y+': 'Y-',
  'Y-': 'Y+',
  'Z+': 'Z-',
  'Z-': 'Z+',
};

function initCanvas(canvas: HTMLCanvasElement, camera: CameraTransformInteface): () => void {
  const painter = new Painter(canvas, makeTipClickHandler(camera));
  const actualPaint = () => {
    painter.updateCamera(camera.getOrientation());
    painter.paint();
  };
  let id = 0;
  const paint = () => {
    window.cancelAnimationFrame(id);
    id = window.requestAnimationFrame(actualPaint);
  };
  camera.addChangeListener(paint);
  const observer = new ResizeObserver(paint);
  observer.observe(canvas);
  paint();
  // Return the function to use to detach from the canvas.
  return () => {
    camera.removeChangeListener(paint);
    observer.unobserve(canvas);
    painter.detach();
  };
}

function makeTipClickHandler(camera: CameraTransformInteface) {
  return (name: string) => {
    const orientation = ORIENTATIONS[name];
    if (!orientation) return;

    const [x1, y1, z1, w1] = camera.getOrientation();
    const [x2, y2, z2, w2] = orientation;
    const x = x1 - x2;
    const y = y1 - y2;
    const z = z1 - z2;
    const w = w1 - w2;
    const dist = x * x + y * y + z * z + w * w;
    if (dist < 1e-6) {
      const backOrientation = ORIENTATIONS[BACK[name]];
      if (backOrientation) {
        camera.setOrientation(backOrientation);
      }
      return;
    }
    camera.setOrientation(orientation);
  };
}

function join(...classes: unknown[]): string {
  return classes.filter((item) => typeof item === 'string').join(' ');
}
