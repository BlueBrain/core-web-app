import { GenericEventInterface } from '../utils/generic-event';
import {
  isNumber,
  isObject,
  isString,
  isBoolean,
  assertObject,
  assertOptionalString,
  assertNumber,
  assertString,
  assertType,
} from '@/util/type-guards';
import { logError } from '@/util/logger';

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
  host: string;
  port: number;
}

export function assertJsonRpcServiceAddress(data: unknown): asserts data is JsonRpcServiceAddress {
  assertType(data, { host: 'string', port: 'number' });
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

export type JsonRpcQueryResult = JsonRpcQuerySuccess | JsonRpcQueryFailure;

export function isJsonRpcMessage(data: any): data is {
  id?: string;
  method: string;
  result?: SerializableData;
  params?: SerializableData;
  error?: {
    code: number;
    message: string;
  };
} {
  try {
    assertObject(data);
    const { id, method, error } = data;
    assertOptionalString(id, 'data.id');
    assertOptionalString(method, 'data.method');
    if (typeof error !== 'undefined') {
      assertObject(error, 'data.error');
      const { code, message } = error;
      assertNumber(code, 'data.error.code');
      assertString(message, 'data.error.message');
    }
    return true;
  } catch (ex) {
    logError('We received an invalid JSON message:', data);
    logError(ex);
    return false;
  }
}
