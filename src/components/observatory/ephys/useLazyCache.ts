// @ts-ignore (no ts definition yet)
import { createCache } from 'node-cache-engine';

const MAX_STORAGE_SIZE = 1e8; // 100MB;

const cache = createCache({
  size: MAX_STORAGE_SIZE,
});

// TODO
// It might be better to break this out into the APP
// instead of a plugin.
export default function useLazyCache<T>() {
  return [cache.add, cache.get] as [
    (key: string, value: any) => void,
    (key: string) => T | undefined
  ];
}
