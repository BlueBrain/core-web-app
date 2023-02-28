/* eslint-disable @typescript-eslint/no-use-before-define */
import { Vector3, half, clamp } from '../utils/calc';
import GenericEvent from '../utils/generic-event';
import BraynsWrapper from '../wrapper/wrapper';
import { logError } from '@/util/logger';

export interface CameraSettings {
  latitude: number;
  longitude: number;
  target: Vector3;
  distance: number;
}

export default class CameraManager {
  public readonly eventChange = new GenericEvent<CameraSettings>();

  private busyRefreshing = false;

  private refreshHasBeenScheduled = false;

  private settings: CameraSettings = {
    latitude: 0,
    longitude: 0,
    target: [6587, 3849, 5687],
    distance: 18837 - 5687,
  };

  constructor(private readonly wrapper: BraynsWrapper) {
    this.update({});
  }

  get(): CameraSettings {
    const { latitude, longitude, target, distance } = this.settings;
    return {
      latitude,
      longitude,
      distance,
      target: [...target],
    };
  }

  update(settings: Partial<CameraSettings>) {
    this.settings = {
      ...this.settings,
      ...settings,
    };
    const halfPi = half(Math.PI) - 1e-5;
    this.settings.latitude = clamp(this.settings.latitude, -halfPi, halfPi);
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
    this.eventChange.dispatch(this.get());
  }
}
