export default class Thread {
  static terminate(thread) {
    thread[$worker].terminate();
  }

  constructor(workerFactory) {
    this[$worker] = new WebWorker(workerFactory);

    return new Proxy(this, { get: (target, name) => {
      if (name === $worker) {
        return this[$worker];
      }

      return (...args) => {
        const transferables = args
          .flatMap(arg => typeof arg === 'object' && arg[$transferable] ? arg.transferables : []);

        const taskId = this[$worker].nextTaskId();

        return new Promise((resolve, reject) => {
          const eventHandler = (e) => {
            if (e.data.taskId !== taskId) return;

            if (e.data.error) {
              return reject(e.data.error);
            }

            this[$worker].worker.removeEventListener('message', eventHandler);
            this[$worker].busy = false;
            resolve(e.data.payload);
            this[$worker].onTaskDone();
          };
          this[$worker].worker.addEventListener('message', eventHandler);
          this[$worker].worker.postMessage({ module: name, taskId, args } , transferables);
          this[$worker].busy = true;
        });
      };
    }});
  }
}
