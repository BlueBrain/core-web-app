import { GenericEventInterface } from '../utils/generic-event';
import { isNumber, isObject, isString, isBoolean, assertType } from '@/util/type-guards';
import { logError } from '@/util/logger';

export interface JsonRpcServiceInterface {
  /**
   * For debug purpose, we can record all the queries we have done.
   * With the entrypoint and the params, but not the results.
   */
  recording: boolean;

  /**
   * Empty the list of recorded queries just after returning them.
   * @returns The list of previously recorded queries.
   */
  purgeRecordedQueries(): Array<{
    entryPoint: string;
    param?: unknown;
  }>;

  exec(entryPointName: string, param?: unknown, chunk?: ArrayBuffer | string): Promise<unknown>;

  execLongTask(
    entryPointName: string,
    param?: unknown,
    onProgress?: ProgressHandler,
    chunk?: ArrayBuffer
  ): LongTask;
}

export default interface Progress {
  /** Percentage of progress between 0 and 1. */
  value?: number;
  /** Optional label of the current step. */
  label?: string;
}

export type ProgressHandler = (this: void, progress: Progress) => void;

/**
 * This type can be converted to/from a string.
 * Merely because it has no function (no callable attribute).
 */
export type SerializableData =
  | null
  | number
  | string
  | boolean
  | ArrayBuffer
  | [number, number, number]
  | [number, number, number, number]
  | SerializableData[]
  | { [key: string]: SerializableData | undefined };

export interface LongTask {
  /**
   * Call this function to cancel the task before its normal end.
   * You will get an error in the promise though.
   */
  cancel(): void;
  promise: Promise<unknown>;
  eventProgress: GenericEventInterface<Progress>;
}

export interface JsonRpcUpdate {
  name: string;
  value: SerializableData;
}

export interface JsonRpcServiceAddress {
  backendHost: string;
  rendererHost: string;
}

export function assertJsonRpcServiceAddress(data: unknown): asserts data is JsonRpcServiceAddress {
  assertType(data, { host: 'string', backendPort: 'number', rendererPort: 'number' });
}

interface JsonRpcQuery {
  entrypoint: string;
  param?: unknown;
}

export interface JsonRpcQuerySuccess extends JsonRpcQuery {
  success: true;
  result: unknown;
}

export interface JsonRpcQueryFailure extends JsonRpcQuery {
  success: false;
  code: number;
  message: string;
  data?: string[];
}

export function isJsonRpcQueryFailure(data: unknown): data is JsonRpcQueryFailure {
  if (!isObject(data)) return false;
  const { success, code, message } = data;
  return isBoolean(success) && isNumber(code) && isString(message);
}

export function isJsonRpcQuerySuccess(data: unknown): data is JsonRpcQuerySuccess {
  try {
    assertType(data, {
      entrypoint: 'string',
      param: ['?', 'unknown'],
      success: 'boolean',
      result: 'unknown',
    });
    return true;
  } catch (ex) {
    return false;
  }
}

export type JsonRpcQueryResult = JsonRpcQuerySuccess | JsonRpcQueryFailure;

export function isJsonRpcMessage(data: any): data is {
  id?: string | null;
  method: string;
  result?: SerializableData;
  params?: SerializableData;
  error?: {
    code: number;
    message?: string;
    name?: string;
    data?:
      | null
      | {
          message: string;
        }
      | string[];
  };
} {
  try {
    assertType(data, {
      id: ['?', ['|', 'string', 'null']],
      method: ['?', 'string'],
      result: 'unknown',
      params: 'unknown',
      error: [
        '?',
        {
          code: 'number',
          message: ['?', 'string'],
          name: ['?', 'string'],
          data: [
            '?',
            [
              '|',
              'null',
              [
                '?',
                {
                  message: 'string',
                },
              ],
              ['array', 'string'],
            ],
          ],
        },
      ],
    });
    return true;
  } catch (ex) {
    logError('We received an invalid JSON message:', data);
    logError(ex);
    return false;
  }
}
