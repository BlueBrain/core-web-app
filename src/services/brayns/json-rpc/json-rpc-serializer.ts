import GenericEvent from '../utils/generic-event';
import JsonRpcService from './json-rpc';
import Progress, { JsonRpcServiceInterface, LongTask, ProgressHandler } from './types';

export default class JsonRpcSerializerService implements JsonRpcServiceInterface {
  private readonly lockKey: string;

  constructor(private readonly service: JsonRpcService) {
    this.lockKey = window.crypto.randomUUID();
  }

  get recording() {
    return this.service.recording;
  }

  set recording(value: boolean) {
    this.service.recording = value;
  }

  purgeRecordedQueries(): { entryPoint: string; param?: unknown }[] {
    return this.service.purgeRecordedQueries();
  }

  readonly exec = (
    entryPointName: string,
    param?: unknown,
    chunk?: ArrayBuffer | string
  ): Promise<unknown> =>
    new Promise((resolve, reject) => {
      navigator.locks.request(this.lockKey, async () => {
        try {
          const data = await this.service.exec(entryPointName, param, chunk);
          resolve(data);
        } catch (ex) {
          reject(ex);
        }
      });
    });

  readonly execLongTask = (
    entryPointName: string,
    param?: unknown,
    onProgress?: ProgressHandler,
    chunk?: ArrayBuffer
  ): LongTask => {
    const eventProgress = new GenericEvent<Progress>();
    const eventCancel = new GenericEvent<void>();
    if (onProgress) {
      eventProgress.addListener(onProgress);
    }
    const promise = new Promise((resolve, reject) => {
      navigator.locks.request(this.lockKey, async () => {
        try {
          const longTask = this.service.execLongTask(
            entryPointName,
            param,
            (arg: Progress) => eventProgress.dispatch(arg),
            chunk
          );
          eventCancel.addListener(() => longTask.cancel());
          longTask.promise.then(resolve).catch(reject);
        } catch (ex) {
          reject(ex);
        }
      });
    });
    return {
      promise,
      cancel() {
        eventCancel.dispatch();
      },
      eventProgress,
    };
  };
}
