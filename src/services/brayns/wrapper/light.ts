import JsonRpcService from '../json-rpc/json-rpc';
import { BraynsColorOpaque } from '../types';
import { assertBraynsModel } from './types';

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
