export interface GenericEventInterface<T> {
  addListener(listener: (arg: T) => void): void;
  removeListener(listener: (arg: T) => void): void;
}

export default class GenericEvent<T> implements GenericEventInterface<T> {
  private listeners: Array<(arg: T) => void> = [];

  addListener(listener: (arg: T) => void) {
    const { listeners } = this;
    if (listeners.includes(listener)) return;

    listeners.push(listener);
  }

  removeListener(listener: (arg: T) => void) {
    this.listeners = this.listeners.filter((item) => item !== listener);
  }

  dispatch(arg: T) {
    this.listeners.forEach((listener) => listener(arg));
  }
}
