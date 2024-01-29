import { JsonRpcServiceInterface } from '@brayns/json-rpc/types';
import Calc, { Vector3 } from '@brayns/utils/calc';

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
        /**
         * We set the position far away to avoid clipping from the near plane.
         */
        const position = Calc.addVectors(
          params.target,
          Calc.scaleVector(
            Calc.normalizeVector(Calc.subVectors(params.position, params.target)),
            1e6
          )
        );
        await this.renderer.exec('set-camera-view', {
          ...params,
          position,
        });
      } while (this.nextQueryParams);
    } finally {
      this.queryInProgress = false;
    }
  }
}
