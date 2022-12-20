// eslint-disable-next-line import/prefer-default-export
export function debounce(func: Function, wait: number, immediate?: boolean) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function debouncedFuncExecutor(this: any, ...args: any[]) {
    const context = this;
    clearTimeout(timeoutId as Parameters<typeof clearTimeout>[0]);

    timeoutId = setTimeout(() => {
      timeoutId = null;

      if (!immediate) func.apply(context, args);
    }, wait);

    if (immediate && !timeoutId) func.apply(context, ...args);
  };
}
