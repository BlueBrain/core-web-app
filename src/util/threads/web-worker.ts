export default class WebWorker {
  private taskId: number = 0;

  public worker: Worker;

  public busy: boolean = false;

  // eslint-disable-next-line class-methods-use-this
  public onTaskDone: Function = () => {};

  constructor(workerFactory: () => Worker) {
    this.worker = workerFactory();
  }

  terminate() {
    this.worker.terminate();
  }

  nextTaskId() {
    const currentTaskId = this.taskId;
    this.taskId += 1;

    return currentTaskId;
  }
}
