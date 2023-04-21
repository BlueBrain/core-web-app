export default class WebWorker {
  _nextTaskId = 0;

  worker = null;

  busy = false;

  onTaskDone = () => {};

  constructor(workerFactory) {
    this.worker = workerFactory();
  }

  terminate() {
    this.worker.terminate();
  }

  nextTaskId() {
    return this._nextTaskId++;
  }
}
