import React from 'react';

/**
 * A boolean state that will automatically switch back to `false`
 * after a delay.
 * @param delay Switch back to `false` after `delay` msec.
 */
export function useSignal(delay: number): [value: boolean, set: (value: boolean) => void] {
  const refId = React.useRef(0);
  const [signal, setSignal] = React.useState(false);

  return [
    signal,
    (value: boolean) => {
      window.clearTimeout(refId.current);
      setSignal(value);
      if (value) {
        refId.current = window.setTimeout(() => {
          setSignal(false);
        }, delay);
      }
    },
  ];
}
