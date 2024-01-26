import { JsonRpcServiceInterface } from '../../common/json-rpc/types';
import { BraynsColorTransparent } from '../../common/types';
import { assertBraynsModelArray } from './types';

export default class Mesh {
  constructor(private readonly renderer: JsonRpcServiceInterface) {}

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
