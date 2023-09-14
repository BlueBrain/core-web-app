import { JsonRpcServiceInterface } from '../../common/json-rpc/types';
import { BraynsColorOpaque } from '../../common/types';
import { Vector3 } from '../../common/utils/calc';
import { assertBraynsModel } from './types';

export default class Light {
  constructor(private readonly renderer: JsonRpcServiceInterface) {}

  clear() {
    return this.renderer.exec('clear-lights');
  }

  async addAmbient(params: { color: BraynsColorOpaque; intensity: number }) {
    const model = await this.renderer.exec('add-light-ambient', params);
    assertBraynsModel(model, 'addAmbientLightResult');
    return model.model_id;
  }

  async addDirectional(params: {
    direction: Vector3;
    color: BraynsColorOpaque;
    intensity: number;
  }) {
    const model = await this.renderer.exec('add-light-directional', {
      direction: params.direction,
      color: params.color,
      intensity: params.intensity,
    });
    assertBraynsModel(model, 'addAmbientLightResult');
    return model.model_id;
  }
}
