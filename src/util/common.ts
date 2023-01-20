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

export const switchStateType = {
  COUNT: 'count',
  DENSITY: 'density',
};

// formats the number in the 4th significant digit and uses US locale for commas in thousands
export const formatNumber = (num: number) => Number(num.toPrecision(4)).toLocaleString('en-US');
