import State from '../state';
import Settings from '../settings';
import Calc, { Quaternion, Vector3 } from './calc';

const MIN_DISTANCE = 10;
const MAX_DISTANCE = 50000;
/** Number to add/remove to the `distance` at every zomm out/in step. */
const ZOOM_FACTOR = 0.1;

export interface CameraTransformInteface {
  addChangeListener(listener: () => void): void;
  removeChangeListener(listener: () => void): void;
  reset(): void;
  rotateAroundX(angleInRadians: number): void;
  rotateAroundY(angleInRadians: number): void;
  rotateAroundZ(angleInRadians: number): void;
  translate(x: number, y: number, z?: number): void;
  getDistance(): number;
  getTarget(): [x: number, y: number, z: number];
  getOrientation(): [x: number, y: number, z: number, w: number];
  setOrientation(quaternion: [x: number, y: number, z: number, w: number]): void;
  zoomIn(factor?: number): void;
  zoomOut(factor?: number): void;
}

const CameraTransform: CameraTransformInteface = {
  addChangeListener(listener: () => void) {
    State.camera.addListener(listener);
  },

  removeChangeListener(listener: () => void) {
    State.camera.removeListener(listener);
  },

  reset() {
    State.camera.value = Settings.CAMERA;
  },

  getDistance(): number {
    return State.camera.value.distance;
  },

  getTarget(): [x: number, y: number, z: number] {
    return State.camera.value.target;
  },

  getOrientation(): [x: number, y: number, z: number, w: number] {
    return State.camera.value.orientation;
  },

  setOrientation(orientation: Quaternion) {
    State.camera.value = {
      ...State.camera.value,
      orientation,
    };
  },

  /**
   * Translate the target along the camera axis.
   */
  translate(x: number, y: number, z = 0) {
    const { orientation, target, distance } = State.camera.value;
    const axis = Calc.getAxisFromQuaternion(orientation);
    // This factor has been figured out manually.
    const factor = distance * 0.2;
    State.camera.value = {
      ...State.camera.value,
      target: Calc.addVectors(
        target,
        Calc.scaleVector(axis.x, x * factor),
        Calc.scaleVector(axis.y, y * factor),
        Calc.scaleVector(axis.z, z * factor)
      ),
    };
  },

  rotateAroundX(angleInRadians: number) {
    const { orientation } = State.camera.value;
    const axis = Calc.getAxisFromQuaternion(orientation);
    const axisX = [...axis.x] as Vector3;
    State.camera.value = {
      ...State.camera.value,
      orientation: Calc.getQuaternionFromAxis({
        x: Calc.rotateVectorAroundVector(axis.x, axisX, angleInRadians),
        y: Calc.rotateVectorAroundVector(axis.y, axisX, angleInRadians),
        z: Calc.rotateVectorAroundVector(axis.z, axisX, angleInRadians),
      }),
    };
  },

  rotateAroundY(angleInRadians: number) {
    const { orientation } = State.camera.value;
    const axis = Calc.getAxisFromQuaternion(orientation);
    const axisY = [...axis.y] as Vector3;
    State.camera.value = {
      ...State.camera.value,
      orientation: Calc.getQuaternionFromAxis({
        x: Calc.rotateVectorAroundVector(axis.x, axisY, angleInRadians),
        y: Calc.rotateVectorAroundVector(axis.y, axisY, angleInRadians),
        z: Calc.rotateVectorAroundVector(axis.z, axisY, angleInRadians),
      }),
    };
  },

  rotateAroundZ(angleInRadians: number) {
    const { orientation } = State.camera.value;
    const axis = Calc.getAxisFromQuaternion(orientation);
    const axisZ = [...axis.z] as Vector3;
    State.camera.value = {
      ...State.camera.value,
      orientation: Calc.getQuaternionFromAxis({
        x: Calc.rotateVectorAroundVector(axis.x, axisZ, angleInRadians),
        y: Calc.rotateVectorAroundVector(axis.y, axisZ, angleInRadians),
        z: Calc.rotateVectorAroundVector(axis.z, axisZ, angleInRadians),
      }),
    };
  },

  zoomIn(factor = 1) {
    const distance = Math.max(
      MIN_DISTANCE,
      State.camera.value.distance * (1 - factor * ZOOM_FACTOR)
    );
    State.camera.value = {
      ...State.camera.value,
      distance,
    };
  },

  zoomOut(factor = 1) {
    const distance = Math.min(
      MAX_DISTANCE,
      State.camera.value.distance * (1 + factor * ZOOM_FACTOR)
    );
    State.camera.value = {
      ...State.camera.value,
      distance,
    };
  },
};

export default CameraTransform;
