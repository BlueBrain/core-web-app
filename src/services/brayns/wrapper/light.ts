import { assertBraynsModel } from './types';
import JsonRpcService from '@/services/brayns/json-rpc/json-rpc';
import { BraynsColorOpaque } from '@/services/brayns/types';

export default class Light {
  constructor(private readonly renderer: JsonRpcService) {}

  clear() {
    return this.renderer.exec('clear-lights');
  }

  async addAmbient(params: { color: BraynsColorOpaque; intensity: number }) {
    const model = await this.renderer.exec('add-light-ambient', params);
    assertBraynsModel(model, 'addAmbientLightResult');
    return model.model_id;
  }
}
