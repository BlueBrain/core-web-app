/* eslint-disable @typescript-eslint/no-use-before-define */
import Calc, { Vector3, half } from '../utils/calc';
import GenericEvent from '../utils/generic-event';
import BraynsWrapper from '../wrapper/wrapper';
import { logError } from '@/util/logger';

export interface CameraEulerSettings {
  latitude: number;
  longitude: number;
  tilt: number;
  target: Vector3;
  distance: number;
}

export default class CameraManager {
  public readonly eventChange = new GenericEvent<CameraEulerSettings>();

  private busyRefreshing = false;

  private refreshHasBeenScheduled = false;

  private settings: CameraEulerSettings = {
    latitude: 0,
    longitude: 0,
    tilt: 0,
    target: [6587, 3849, 5687],
    distance: 13150,
  };

  constructor(private readonly wrapper: BraynsWrapper) {
    this.updateEulerSettings({});
  }

  getEulerSettings(): CameraEulerSettings {
    const { latitude, longitude, tilt, target, distance } = this.settings;
    return {
      latitude,
      longitude,
      tilt,
      distance,
      target: [...target],
    };
  }

  updateEulerSettings(settings: Partial<CameraEulerSettings>) {
    this.settings = {
      ...this.settings,
      ...settings,
    };
    const halfPi = half(Math.PI) - 1e-5;
    this.settings.latitude = Calc.clamp(this.settings.latitude, -halfPi, halfPi);
    this.refresh();
    this.dispatch();
  }

  private readonly refresh = () => {
    if (this.busyRefreshing) {
      this.refreshHasBeenScheduled = true;
      return;
    }

    this.busyRefreshing = true;
    this.wrapper
      .setCameraView(this.convertSettingsToCameraView())
      .then(() => {
        this.wrapper.repaint();
        this.busyRefreshing = false;
        if (this.refreshHasBeenScheduled) {
          this.refreshHasBeenScheduled = false;
          window.requestAnimationFrame(this.refresh);
        }
      })
      .catch((ex) => {
        logError(ex);
        this.busyRefreshing = false;
      });
  };

  private convertSettingsToCameraView(): { position: Vector3; target: Vector3; up: Vector3 } {
    const { latitude, longitude, target, distance } = this.settings;
    const [tx, ty, tz] = target;
    const r = Math.cos(latitude);
    const y = Math.sin(latitude);
    const x = r * Math.cos(longitude);
    const z = r * Math.sin(longitude);
    const up: Vector3 = [0, -1, 0];
    return {
      target,
      position: [tx + x * distance, ty + y * distance, tz + z * distance],
      up,
    };
  }

  dispatch() {
    this.eventChange.dispatch(this.getEulerSettings());
  }
}
