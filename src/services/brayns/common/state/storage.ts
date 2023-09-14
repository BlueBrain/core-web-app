interface StorageInterface {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

class MemoryStorage implements StorageInterface {
  private readonly dic = new Map<string, string>();

  getItem(key: string): string | null {
    const value = this.dic.get(key);
    return value ?? null;
  }

  setItem(key: string, value: string): void {
    this.dic.set(key, value);
  }

  removeItem(key: string): void {
    this.dic.delete(key);
  }
}

const memoryStorage = new MemoryStorage();

export function getSessionStorage(): StorageInterface {
  const isClientProcessing: boolean = ((): boolean => typeof window !== 'undefined')();
  return isClientProcessing ? window.sessionStorage : memoryStorage;
}

export function getLocalStorage(): StorageInterface {
  const isClientProcessing: boolean = ((): boolean => typeof window !== 'undefined')();
  return isClientProcessing ? window.localStorage : memoryStorage;
}
