import { $transferable } from './constants';

function isTransferable(thing: unknown) {
  return thing && typeof thing === 'object';
}

export function expose(moduleObj: { [moduleName: string]: Function }) {
  window.addEventListener('message', async (e) => {
    const { args, module, taskId } = e.data;

    if (!moduleObj[module]) {
      postMessage({ taskId, error: `Module ${module} is not available` });
      return;
    }

    const moduleResult = moduleObj[module](...args);

    if (moduleResult[$transferable]) {
      postMessage({ taskId, payload: moduleResult.payload }, moduleResult.transferables);
    } else {
      postMessage({ taskId, payload: moduleResult });
    }
  });
}

export function transfer(payload: any, transferables: any[]) {
  if (!transferables && !isTransferable(payload)) {
    throw new Error('Payload is not tranferable');
  }

  return {
    payload,
    [$transferable]: true,
    transferables: transferables || [payload],
  };
}
