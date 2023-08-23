import State from '../../common/state';
import Calc, { Vector3 } from '../../common/utils/calc';
import BraynsWrapper from '../wrapper/wrapper';
import { logError } from '@/util/logger';

/**
 * This class will listen to any camera settings change
 * and will send Brayns requests to apply changes to
 * the scene.
 * This class is responsible of preventing parallel requests
 * to Brayns as far as camera settings are concerned. That
 * means that the number of queries can be lower than the
 * number of camera settings change events. We don't send
 * a new request until the previous one has answered.
 */
export default class CameraWatcher {
  private busyRefreshing = false;

  private refreshHasBeenScheduled = false;

  constructor(private readonly wrapper: BraynsWrapper) {
    State.camera.addListener(this.refresh);
    this.refresh();
  }

  detach() {
    State.camera.removeListener(this.refresh);
  }

  private readonly refresh = async () => {
    if (this.busyRefreshing) {
      this.refreshHasBeenScheduled = true;
      return;
    }

    this.busyRefreshing = true;
    try {
      await this.wrapper.setCameraView(convertSettingsToCameraView());
      this.wrapper.repaint();
      this.busyRefreshing = false;
      if (this.refreshHasBeenScheduled) {
        this.refreshHasBeenScheduled = false;
        window.requestAnimationFrame(this.refresh);
      }
    } catch (ex) {
      logError(ex);
      this.busyRefreshing = false;
    }
  };
}

function convertSettingsToCameraView(): { position: Vector3; target: Vector3; up: Vector3 } {
  const { orientation, target, distance } = State.camera.value;
  const axis = Calc.getAxisFromQuaternion(orientation);
  const position = Calc.addVectors(target, Calc.scaleVector(axis.z, -distance));
  const up = axis.y;
  return { target, position, up };
}
