import { RefObject, useEffect, useRef } from 'react';

export function on<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T['addEventListener']> | [string, Function | null, ...any]
): void {
  if (obj && obj.addEventListener) {
    obj.addEventListener(...(args as Parameters<HTMLElement['addEventListener']>));
  }
}

export function off<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T['removeEventListener']> | [string, Function | null, ...any]
): void {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(...(args as Parameters<HTMLElement['removeEventListener']>));
  }
}

const defaultEvents = ['mousedown', 'touchstart'];
const useOnClickOutside = <E extends Event = Event>(
  ref: RefObject<HTMLElement | null>,
  onClickAway: (event: E) => void,
  events: string[] = defaultEvents,
  ignore?: (event: any) => boolean
) => {
  const savedCallback = useRef(onClickAway);

  useEffect(() => {
    savedCallback.current = onClickAway;
  }, [onClickAway]);

  useEffect(() => {
    const handler = (event: E) => {
      const { current: el } = ref;
      if (ignore?.(event)) return;
      if (el && !el.contains(event.target as HTMLElement)) savedCallback.current(event);
    };
    events.forEach((eventName) => {
      on(document, eventName, handler);
    });

    return () => {
      events.forEach((eventName) => {
        off(document, eventName, handler);
      });
    };
  }, [events, ignore, ref]);
};

export default useOnClickOutside;
