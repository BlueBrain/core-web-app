/* eslint-disable max-classes-per-file */
/**
 * @example
 * ```
 * const cache = new LimitedCacheMap<string, string>(1e6, (value: string) => value.length)
 * ...
 * const mesh = cache.get(
 *   url,
 *   async () => {
 *     const resp = await fetch(url)
 *     return resp.text()
 *   }
 * )
 * ```
 */
export class LimitedCacheMap<KeyType, ValueType> {
  private readonly cache = new Map<KeyType, ValueType>();

  private readonly keysCircle: KeyType[] = [];

  private currentLength = 0;

  /**
   * @param maxLength Total size of what this cache will keep in memory
   * @param computeLength A function to compute the size of any element
   */
  constructor(
    private readonly maxLength: number,
    private readonly computeLength: (item: ValueType) => number
  ) {}

  /**
   * @param key Key of the item to store/retrieve to/from cache
   * @param factory Async function to create the item if it is not
   * already in cache.
   */
  async get(key: KeyType, factory: () => Promise<ValueType>): Promise<ValueType> {
    const itemInCache = this.cache.get(key);
    if (itemInCache) return itemInCache;

    const item = await factory();
    this.cache.set(key, item);
    this.keysCircle.push(key);
    this.currentLength += this.computeLength(item);
    while (this.keysCircle.length > 0 && this.currentLength > this.maxLength) {
      const oldItemKey = this.keysCircle.shift();
      if (!oldItemKey) continue;

      const oldItemVal = this.cache.get(oldItemKey);
      if (!oldItemVal) continue;

      this.currentLength -= this.computeLength(oldItemVal);
      this.cache.delete(oldItemKey);
    }
    return item;
  }
}

export class LimitedStringCacheMap<KeyType = string> extends LimitedCacheMap<KeyType, string> {
  constructor(maxLength: number) {
    super(maxLength, (value: string) => value.length);
  }
}
