/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { JsonRpcServiceInterface } from '../json-rpc/types';
import { Vector4 } from '../utils/calc';
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
    // We need to wait for the Backend to fix this entrypoint.
    // And we will use it to know haw many cells are available
    // for display.
    // const info = await this.backend.exec('ci-get-general-info', { path });
    // console.log('🚀 [circuit] info = ', info); // @FIXME: Remove this line written on 2023-03-21 at 15:10
    const params = {
      loader_name: 'SONATA loader',
      loader_properties: {
        node_population_settings: [
          {
            node_population: 'root__neurons',
            node_percentage: 0.04,
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
    return modelId;
  }

  async colorModel(id: number, method: string, values: Record<string, Vector4>) {
    await this.renderer.exec('color-model', {
      id,
      method,
      values,
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
