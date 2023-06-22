/* eslint-disable lodash/import-scope */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable class-methods-use-this */
import { isNil } from 'lodash';
import Async from '../utils/async';
import GenericEvent from '../utils/generic-event';
import Progress, {
  isJsonRpcMessage,
  isJsonRpcQueryFailure,
  isJsonRpcQuerySuccess,
  JsonRpcQueryFailure,
  JsonRpcQueryResult,
  JsonRpcQuerySuccess,
  JsonRpcServiceInterface,
  JsonRpcUpdate,
  LongTask,
  ProgressHandler,
  SerializableData,
} from './types';
import { makeDebugToggler } from './trace';
import { isArrayBuffer, isNumber, isObject, isString, isStringArray } from '@/util/type-guards';
import { logError } from '@/util/logger';

/**
 * Used to generate unique IDs for WebSockets queries.
 */
let globalIncrementalId = 0;

interface PendingQuery {
  id: string;
  entryPointName: string;
  timestamp: number;
  param?: unknown;
  resolve(result: JsonRpcQueryResult): void;
}

export default class JsonRpcService implements JsonRpcServiceInterface {
  public recording: boolean = false;

  // `true` if WebSocket is connected.
  public readonly eventConnectionStatus: GenericEvent<boolean>;

  public readonly eventUpdate: GenericEvent<JsonRpcUpdate>;

  public readonly host: string;

  public readonly port: number;

  private recordedQueries: Array<{
    entryPoint: string;
    param?: unknown;
  }> = [];

  private readonly secure: boolean;

  private readonly trace: (prefix: string, method: string, ...params: unknown[]) => void;

  constructor(
    hostAndPort: string,
    {
      secure = true,
      trace = false,
    }: Partial<{
      secure: boolean;
      /**
       * Criteria that tells us if an entrypoint has to be traced in the console.
       * * `false`: Nothing is logged.
       * * `true`: Everything is logged.
       * * __string__: Log only entrypoints containing this string in the name.
       * * __function__: Log only if this function returns true when given the entrypoint name.
       */
      trace: boolean | string | string[] | ((method: string) => boolean);
    }> = {}
  ) {
    this.secure = secure;
    this.trace = makeDebugToggler(trace);
    const [host, port] = extractHostAndPort(hostAndPort);
    this.host = host;
    this.port = port;
    this.eventUpdate = new GenericEvent<JsonRpcUpdate>();
    this.eventConnectionStatus = new GenericEvent<boolean>();
  }

  purgeRecordedQueries(): {
    entryPoint: string;
    param?: unknown /* eslint-disable no-continue */;
  }[] {
    const list = this.recordedQueries;
    this.recordedQueries = [];
    return list;
  }

  readonly exec = async (
    entryPoint: string,
    param?: unknown,
    chunk?: ArrayBuffer | string
  ): Promise<unknown> => {
    if (this.recording)
      this.recordedQueries.push({
        entryPoint,
        param,
      });
    try {
      const data: unknown = await this.tryToExec(entryPoint, param, chunk);
      if (this.isError(data)) {
        logError(`Error while calling entry point "${entryPoint}":`, param);
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw data;
      }
      if (!this.isSuccess(data)) {
        logError('JSON-RPC message was expected but we got:', data);
        throw Error('Invalid JSON-RPC message!');
      }
      return data.result;
    } catch (ex) {
      logError(ex);
      throw ex;
    }
  };

  execLongTask(
    entryPoint: string,
    param?: unknown,
    onProgress?: ProgressHandler,
    chunk?: ArrayBuffer
  ): LongTask {
    const { ws } = this;
    if (!ws) throw Error('JsonRpcService is not connected yet!');

    if (this.recording)
      this.recordedQueries.push({
        entryPoint,
        param,
      });
    try {
      const id = this.nextId();
      const message = {
        jsonrpc: '2.0',
        id,
        method: entryPoint,
        params: param,
      };
      const eventProgress = new GenericEvent<Progress>();
      const handleBroadcast = makeBroadcastHandle(id, (progress: Progress) => {
        eventProgress.dispatch(progress);
      });
      if (onProgress) {
        eventProgress.addListener(onProgress);
      }
      const stop = () => {
        this.eventUpdate.removeListener(handleBroadcast);
      };
      this.eventUpdate.addListener(handleBroadcast);
      const promise = this.makeLongTaskPromise(id, entryPoint, param, stop, ws, message, chunk);
      return {
        promise,
        cancel: () => {
          this.eventUpdate.dispatch({
            name: 'progress',
            value: { value: 1, label: 'Cancellation...' },
          });
          ws.send(
            JSON.stringify({
              jsonrpc: '2.0',
              method: 'cancel',
              params: { id },
            })
          );
        },
        eventProgress,
      };
    } catch (ex) {
      logError('Unexpected exception in execLongTask:', ex);
      throw ex;
    }
  }

  private makeLongTaskPromise(
    id: string,
    entryPointName: string,
    param: unknown | undefined,
    stop: () => void,
    ws: WebSocket,
    message: {
      jsonrpc: string;
      id: string;
      method: string;
      params?: unknown;
    },
    chunk?: ArrayBuffer
  ) {
    return new Promise<unknown>((resolve, reject) => {
      this.pendingQueries.set(id, {
        id,
        entryPointName,
        timestamp: Date.now(),
        param: param ?? {},
        resolve: (data: JsonRpcQueryResult) => {
          if (this.isError(data)) {
            reject(Error(`${data.message} (#${data.code})`));
            return;
          }

          stop();
          resolve(data.result);
        },
      });
      try {
        this.trace('»»»', entryPointName, message);
        const encoder = new TextEncoder();
        const messageData = encoder.encode(JSON.stringify(message));
        const chunkLength = chunk ? getChunkLength(chunk) : 0;

        const MESSAGE_OFFSET = Uint32Array.BYTES_PER_ELEMENT;
        const buffLength = MESSAGE_OFFSET + messageData.byteLength + chunkLength;
        const buff = new ArrayBuffer(buffLength);
        const view = new DataView(buff);
        view.setUint32(0, messageData.byteLength, true);
        const data = new Uint8Array(buff);
        data.set(messageData, MESSAGE_OFFSET);
        if (chunk) {
          const CHUNK_OFFSET = MESSAGE_OFFSET + messageData.byteLength;
          data.set(ensureChunkArrayBuffer(chunk), CHUNK_OFFSET);
        }
        ws.send(data);
      } catch (ex) {
        logError('Unable to send a message through WebSocket: ', ex);
        this.pendingQueries.delete(id);
        stop();
        reject(ex);
      }
    });
  }

  isError(data: unknown): data is JsonRpcQueryFailure {
    return isJsonRpcQueryFailure(data) && !data.success;
  }

  isSuccess(data: unknown): data is JsonRpcQuerySuccess {
    return isJsonRpcQuerySuccess(data) && data.success;
  }

  async connect(): Promise<void> {
    for (let maxLoops = 0; maxLoops < 5; maxLoops += 1) {
      const success = await this.actualConnect();
      if (success) return;
      await Async.sleep(300);
    }
    throw Error(`Unable to connect to WebSocket service "${this.getWebSocketURL()}"!`);
  }

  private actualConnect(): Promise<boolean> {
    if (this.ws) {
      try {
        this.ws.close();
      } catch (ex) {
        logError(`Unable to close WSS connection to "${this.getWebSocketURL()}"!`);
      }
      delete this.ws;
    }
    return new Promise((resolve) => {
      const url = this.getWebSocketURL();
      const handleError = (ex: any) => {
        logError(`Unable to connect to JsonRpc Service on "${url.toString()}"!`, ex);
        resolve(false);
      };
      const handleConnectionSuccess = () => {
        const { ws } = this;
        if (!ws) return;

        ws.removeEventListener('open', handleConnectionSuccess);
        ws.removeEventListener('error', handleError);
        resolve(true);
      };
      try {
        const ws = new WebSocket(url);
        this.ws = ws;
        // This is very IMPORTANT!
        // With blobs, we have weird bugs when trying to
        // get the videostreaming messages without binaryType = "arraybuffer".
        ws.binaryType = 'arraybuffer';
        ws.addEventListener('message', this.handleMessage);
        ws.addEventListener('close', this.handleClose);
        ws.addEventListener('open', this.handleOpen);
        ws.addEventListener('error', this.handleError);
        ws.addEventListener('error', handleError);
        ws.addEventListener('open', handleConnectionSuccess);
      } catch (ex) {
        logError(`Connection attempt failed to ${url.toString()}!`, ex);
        resolve(false);
      }
    });
  }

  readonly tryToExec = async (
    entryPointName: string,
    param?: unknown,
    chunk?: ArrayBuffer | string
  ): Promise<JsonRpcQueryResult> => {
    if (!this.ws) {
      logError('WebSocket is still undefined!');
      throw Error('JsonRpcService is not connected yet!');
    }

    return new Promise((resolve, reject) => {
      const id = this.nextId();
      const message = {
        jsonrpc: '2.0',
        id,
        method: entryPointName,
        params: param,
      };
      this.pendingQueries.set(id, {
        id,
        entryPointName,
        timestamp: Date.now(),
        param,
        resolve,
      });
      try {
        const { ws } = this;
        if (!ws) {
          logError('WebSocket is now undefined!');
          throw Error('JsonRpcService is not connected!');
        }
        this.trace('>>>', entryPointName, param);
        const encoder = new TextEncoder();
        const messageData = encoder.encode(JSON.stringify(message));
        const chunkLength = chunk ? getChunkLength(chunk) : 0;
        const buff = new ArrayBuffer(4 + messageData.byteLength + chunkLength);
        const view = new DataView(buff);
        view.setUint32(0, messageData.byteLength, true);
        const data = new Uint8Array(buff);
        data.set(messageData, 4);
        if (chunk)
          data.set(new Uint8Array(ensureChunkArrayBuffer(chunk)), 4 + messageData.byteLength);
        ws.send(data);
      } catch (ex) {
        logError('Unable to send a message through WebSocket: ', ex);
        this.pendingQueries.delete(id);
        reject(ex);
      }
    });
  };

  // #################### PRIVATE ####################

  private ws?: WebSocket;

  private readonly pendingQueries = new Map<string, PendingQuery>();

  private readonly resources = new Map<string, SerializableData>();

  private getWebSocketURL() {
    const { host, port } = this;
    return `${this.secure ? 'wss' : 'ws'}://${getFullQualifiedName(host)}${
      port > 0 ? `:${port}` : ''
    }`;
  }

  private readonly handleMessage = (event: MessageEvent) => {
    if (typeof event.data === 'string') {
      this.handleStringMessage(event.data);
    } else if (isArrayBuffer(event.data)) {
      this.handleBinaryMessage(event.data);
    } else {
      logError('Invalid JSON-RPC response:', event.data);
    }
  };

  private handleStringMessage(text: string, binaryChunk?: ArrayBuffer) {
    try {
      const data = JSON.parse(text) as SerializableData;
      if (!isJsonRpcMessage(data)) {
        logError(`JSON-RPC object was expected @${this.host}:${this.port}`);
        throw Error(`A JSON-RPC object was expected!`);
      }
      const { id, method, result, params, error } = data;
      if (isNil(id)) {
        this.trace('<Event>', method, data);
        this.handleSpontaneousUpdate(method, params ?? null);
        return;
      }
      if (typeof error !== 'undefined') {
        this.handleResponseError(id, convertErrorObject(error));
        return;
      }
      if (binaryChunk) {
        if (!isObject(result)) {
          logError(
            'We cannot append the binary chunk a a $data attribute since the result is not an object:',
            result
          );
        } else {
          result.$data = binaryChunk;
        }
      }
      this.handleResponse(id, result ?? null);
    } catch (ex) {
      logError('Unable to parse websocket incoming message:', ex);
      logError('    text = ', text);
    }
  }

  /**
   * In a binary message, he first Uint32 gives us the length of
   * the text message inside. The rest is pure binary.
   */
  private handleBinaryMessage(data: ArrayBuffer) {
    const view = new DataView(data);
    const txtSize = view.getUint32(0, true);
    const binSize = data.byteLength - 4 - txtSize;
    const decoder = new TextDecoder();
    const txt = decoder.decode(data.slice(4, 4 + txtSize));
    const bin = binSize > 0 ? data.slice(4 + txtSize) : undefined;
    this.handleStringMessage(txt, bin);
  }

  private handleSpontaneousUpdate(name: string, value: SerializableData) {
    this.eventUpdate.dispatch({ name, value });
  }

  private handleResponse(id: string, params: SerializableData) {
    const query = this.pendingQueries.get(id);
    if (typeof query === 'undefined') {
      // Just ignore this message because it is not a response
      // to any of our queries.
      return;
    }
    this.trace(`<<< ${getDuration(query)}`, query.entryPointName, params);
    this.pendingQueries.delete(id);
    const result: JsonRpcQueryResult = {
      success: true,
      result: params,
      entrypoint: query.entryPointName,
      param: query.param,
    };
    query.resolve(result);
  }

  private handleResponseError(
    id: string,
    error: { code: number; message: string; data?: unknown }
  ) {
    const query = this.pendingQueries.get(id);
    if (typeof query === 'undefined') {
      // Just ignore this message because it is not a response
      // to any of our queries.
      logError('Unknown query ID:', id, this.getWebSocketURL());
      return;
    }
    this.pendingQueries.delete(id);
    query.resolve({
      success: false,
      // We use 666 to track when the error code is missing.
      code: error.code ?? 666,
      message: error.message ?? 'Unknown error!',
      data: isStringArray(error.data) ? error.data : undefined,
      entrypoint: query.entryPointName,
      param: query.param,
    });
  }

  /**
   * @returns Next available ID in Base64 encoding.
   */
  private nextId(): string {
    globalIncrementalId += 1;
    return btoa(`${globalIncrementalId}`);
  }

  private readonly handleError = (event: any) => {
    logError('### [WS] Error:', event);
    const { pendingQueries } = this;
    for (const key of Array.from(pendingQueries.keys())) {
      const query = pendingQueries.get(key);
      if (!query) continue;

      query.resolve({
        entrypoint: query.entryPointName,
        code: 666,
        success: false,
        message: 'Unexpected error in WebSocket!',
      });
    }
  };

  private readonly handleClose = () => {
    this.eventConnectionStatus.dispatch(false);
  };

  private readonly handleOpen = () => {
    this.eventConnectionStatus.dispatch(true);
  };
}

function convertErrorObject(error: {
  code: number;
  message?: string;
  name?: string;
  data?: { message: string } | string[] | null;
}): { code: number; message: string; data?: unknown } {
  let { message } = error;
  if (Array.isArray(error.data)) {
    message = error.data.join('\n');
  } else {
    message ??= error.data?.message;
  }
  return {
    code: error.code,
    message: message ?? `Unknown error #${error.code}`,
  };
}

function makeBroadcastHandle(id: string, onProgress?: ProgressHandler) {
  return (update: JsonRpcUpdate) => {
    if (!onProgress) return;
    const { value } = update;
    if (!isObject(value)) {
      logError('Bad format for progress:', update);
      return;
    }
    const {
      amount,
      operation,
      id: progressId,
    } = value as {
      [key: string]: SerializableData;
    };
    if (id !== progressId) return;
    onProgress({
      value: isNumber(amount) ? amount : 0,
      label: isString(operation) ? operation : 'Loading...',
    });
  };
}

function getChunkLength(chunk: string | ArrayBuffer) {
  if (isString(chunk)) return chunk.length;

  return chunk.byteLength;
}

function ensureChunkArrayBuffer(chunk: string | ArrayBuffer): Uint8Array {
  if (!isString(chunk)) return new Uint8Array(chunk);

  const encoder = new TextEncoder();
  const data = encoder.encode(chunk);
  return data;
}

function getDuration(query: PendingQuery) {
  return `(${Date.now() - query.timestamp} ms)`;
}

const RX_BB5_NODE = /^r[0-9]+i[0-9]+n[0-9]+$/gu;

/**
 * Host of type `r2i7n31` will be converted in `r2i7n31.bbp.epfl.ch`.
 */
function getFullQualifiedName(host: string): string {
  RX_BB5_NODE.lastIndex = -1;
  if (RX_BB5_NODE.test(host)) {
    return `${host}.bbp.epfl.ch`;
  }
  return host;
}

function extractHostAndPort(hostAndPort: string): [host: string, port: number] {
  const [host, tail] = hostAndPort.split(':');
  const port = parseInt(tail, 10);
  return [host, Number.isNaN(port) ? 0 : port];
}
