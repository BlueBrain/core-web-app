export default class LimitedCache<T> {
  private readonly keys: string[] = [];

  private readonly map = new Map<string, T>();

  /**
   * This cache will hold the `capacity` most recent items.
   * @param capacity The maximum number of elements to keep in cache.
   */
  constructor(private readonly capacity: number) {}

  async get(key: string, factory: () => Promise<T>): Promise<T> {
    const existingElement = this.map.get(key);
    if (existingElement) return existingElement;

    const newElement = await factory();
    this.keys.push(key);
    this.map.set(key, newElement);
    if (this.keys.length > this.capacity) {
      const oldestKey = this.keys.shift();
      if (oldestKey) this.map.delete(oldestKey);
    }
    return newElement;
  }
}
