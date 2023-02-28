import { logError } from '@/util/logger';
import { assertType } from '@/util/type-guards';

export interface BraynsBounds {
  min: [Number, Number, number];
  max: [Number, Number, number];
}

export interface BraynsModel {
  bounds: BraynsBounds;
  is_visible: boolean;
  model_id: number;
  model_type: string;
}

export function assertBraynsModel(data: unknown, prefix = 'data'): asserts data is BraynsModel {
  try {
    assertType(
      data,
      {
        bounds: {
          min: ['array', 'number'],
          max: ['array', 'number'],
        },
        is_visible: 'boolean',
        model_id: 'number',
        model_type: 'string',
      },
      prefix
    );
  } catch (ex) {
    logError(`${prefix} was expected to be a model, but we got:`, data);
    logError(ex);
    throw ex;
  }
}

export function assertBraynsModelArray(
  data: unknown,
  prefix = 'data'
): asserts data is BraynsModel[] {
  if (!Array.isArray(data)) {
    throw Error(`${prefix} was expected to be an array!`);
  }
  for (let i = 0; i < data.length; i += 1) {
    assertBraynsModel(data[i], `${prefix}[${i}]`);
  }
}
