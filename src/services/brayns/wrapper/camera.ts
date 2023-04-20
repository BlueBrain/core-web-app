/* eslint-disable no-await-in-loop */
import { JsonRpcServiceInterface } from '../json-rpc/types';
import Calc, { Vector3 } from '../utils/calc';

export default class Camera {
  private queryInProgress = false;

  private nextQueryParams: { position: Vector3; target: Vector3; up: Vector3 } | null = null;

  constructor(private readonly renderer: JsonRpcServiceInterface) {}

  /**
   * If we call this function faster that Brayns can deal with,
   * we just squash exceeding queries.
   */
  async setCameraView(lookAt: { position: Vector3; target: Vector3; up: Vector3 }): Promise<void> {
    this.nextQueryParams = lookAt;
    if (this.queryInProgress) return;

    this.queryInProgress = true;
    try {
      do {
        const params = this.nextQueryParams;
        this.nextQueryParams = null;
        const height = Calc.distance(params.position, params.target);
        await this.renderer.exec('set-camera-orthographic', { height });
        await this.renderer.exec('set-camera-view', params);
      } while (this.nextQueryParams);
    } finally {
      this.queryInProgress = false;
    }
  }
}
