export default class LimitedCache<T> {
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
    this.map.set(key, newElement);
    const keys = this.map.keys();
    if (this.map.size > this.capacity) {
      const [oldestKey] = keys;
      if (oldestKey) this.map.delete(oldestKey);
    }
    return newElement;
  }
}
