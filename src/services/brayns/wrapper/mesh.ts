/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { assertBraynsModelArray } from './types';
import JsonRpcService from '@/services/brayns/json-rpc/json-rpc';
import { BraynsColorTransparent } from '@/services/brayns/types';

export default class Mesh {
  constructor(private readonly renderer: JsonRpcService) {}

  /**
   * @param path Path of the OBJ mesh file.
   * @returns Ids of the generated models.
   */
  async add(path: string): Promise<number[]> {
    const task = this.renderer.execLongTask('add-model', {
      loader_name: 'mesh',
      loader_properties: {},
      path: ensureValidPath(path),
    });
    const models = await task.promise;
    assertBraynsModelArray(models, 'models');
    return models.map((model) => model.model_id);
  }

  async setColor(color: BraynsColorTransparent, ...modelIds: number[]) {
    const { renderer } = this;
    for (const modelId of modelIds) {
      await renderer.exec('set-material-phong', {
        model_id: modelId,
        material: {},
      });
      await renderer.exec('color-model', {
        id: modelId,
        method: 'solid',
        values: { color },
      });
    }
  }
}

function ensureValidPath(pathOrURL: string) {
  if (pathOrURL.startsWith('file://')) return pathOrURL.substring('file://'.length);
  return pathOrURL;
}
