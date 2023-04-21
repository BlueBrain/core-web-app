export default class Pool {
  threads = [];
  _tasks = [];
  _onCompleteResolvers = [];

  constructor(workerFactory, size = 4) {
    this.threads = range(size).map(() => new Thread(workerFactory));

    this.threads.map(thread => {
      thread[$worker].onTaskDone = this._onTaskDone.bind(this);
    });
  }

  _idleThread() {
    return this.threads.find(thread => !thread[$worker].busy);
  }

  async _onTaskDone() {
    const idleThread = this._idleThread();

    if (this._tasks.length && idleThread) {
      const [taskExecutor, resolve] = this._tasks.shift();
      const taskResult = await taskExecutor(idleThread);

      return resolve(taskResult);
    }

    this._onCompleteResolvers.forEach(onCompleteResolver => onCompleteResolver());
    this._onCompleteResolvers = [];
  }

  queue(taskExecutor) {
    const idleThread = this._idleThread();

    if (idleThread) {
      return taskExecutor(idleThread);
    }

    return new Promise(resolve => {
      this._tasks.push([taskExecutor, resolve]);
    });
  }

  completed() {
    return new Promise(resolve => {
      this._onCompleteResolvers.push(resolve);
    });
  }

  terminate() {
    this.threads.forEach(thread => Thread.terminate(thread));
  }
}
