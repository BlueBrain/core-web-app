import { JsonRpcServiceInterface } from '../../common/json-rpc/types';
import { Vector4 } from '../../common/utils/calc';
import Settings from '../../common/settings';
import { BraynsWrapperInterface, CircuitLoaderOptions } from './types';
import { assertType } from '@/util/type-guards';

export interface Region {
  acronym: string;
  color: Vector4;
}

export default class Circuit {
  constructor(
    private readonly renderer: JsonRpcServiceInterface,
    private readonly wrapper: BraynsWrapperInterface
  ) {}

  /**
   * Load a circuit and return the resulting model Id.
   * In most scenarii we will use the region acronym as unique nodeset.
   */
  async load(path: string, options: CircuitLoaderOptions): Promise<number> {
    const params = {
      loader_name: 'SONATA loader',
      loader_properties: {
        node_population_settings: [
          {
            node_population: 'root__neurons',
            node_percentage: 1, // 100%, because we use the next attribute (node_count_limit).
            node_count_limit: Settings.NODE_COUNT_LIMIT,
            report_type: 'none',
            neuron_morphology_parameters: {
              load_axon: false,
              load_dendrites: true,
              load_soma: true,
              radius_multiplier: 2,
            },
            node_sets: options.nodeSets,
          },
        ],
      },
      path,
    };
    const data = await this.renderer.exec('add-model', params);
    assertType<
      Array<{
        model_id: number;
        model_type: string;
      }>
    >(data, [
      'array',
      {
        model_id: 'number',
        model_type: 'string',
      },
    ]);
    const models = data.filter((model) => model.model_type === 'neurons');
    const [model] = models;
    const modelId = model.model_id;
    await this.colorModel(modelId, options.color);
    return modelId;
  }

  async colorModel(id: number, color: Vector4) {
    await this.renderer.exec('color-model', {
      id,
      method: 'solid',
      values: { color },
    });
  }

  async deleteAllCircuits() {
    const scene = await this.renderer.exec('get-scene');
    assertType<{
      models: Array<{
        model_id: number;
        model_type: string;
      }>;
    }>(scene, { models: ['array', { model_id: 'number', model_type: 'string' }] });
    for (const model of scene.models) {
      if (model.model_type !== 'neurons') continue;

      await this.renderer.exec('remove-model', { ids: [model.model_id] });
    }
  }
}
