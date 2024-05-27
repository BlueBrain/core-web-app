import { useEffect, useState } from 'react';

type Listener<T> = (args: T) => void;

export class EnhancedSomaLoaderEvent<T> {
  private listeners: Listener<T>[] = [];

  addListener(listener: Listener<T>) {
    this.removeListener(listener);
    this.listeners.push(listener);
  }

  removeListener(listener: Listener<T>) {
    this.listeners = this.listeners.filter((item) => item !== listener);
  }

  dispatch(args: T) {
    this.listeners.forEach((listener) => listener(args));
  }
}

export function useEventValue<T>(event: EnhancedSomaLoaderEvent<T>, initialValue: T): T {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    event.addListener(setValue);
    return () => event.removeListener(setValue);
  }, [event]);

  return value;
}

export function useEventHandler<T>(event: EnhancedSomaLoaderEvent<T>, handler: (args: T) => void) {
  useEffect(() => {
    event.addListener(handler);
    return () => event.removeListener(handler);
  }, [event, handler]);
}
