const Async = {
  sleep(delayInMillisec: number): Promise<void> {
    return new Promise((resolve) => {
      window.setTimeout(resolve, delayInMillisec);
    });
  },

  /**
   * The function to call as much as you want. It will perform the debouce for you.
   * Put in the same args as the `action` function.
   *
   * @param action Action to call. Two consecutive actions cannot be  called if there is
   * less than `delay` ms between them.
   * @param delayInMillisec Number of milliseconds.
   */
  debounce: <T, F extends (...args: never[]) => T>(action: F, delayInMillisec: number) => {
    let timeout = 0;

    return (...args: Parameters<F>): Promise<T> =>
      new Promise((resolve) => {
        window.clearTimeout(timeout);
        timeout = window.setTimeout(() => resolve(action(...args)), delayInMillisec);
      });
  },
};

export default Async;
