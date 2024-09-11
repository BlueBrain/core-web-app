import { useCallback, useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

declare global {
  interface WindowEventMap {
    'session-storage': CustomEvent;
  }
}

type UseSessionStorageOptions<T> = {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  initializeWithValue?: boolean;
};

const IS_SERVER = typeof window === 'undefined';

export function useSessionStorage<T>(
  key: string,
  initialValue: T | (() => T),
  options: UseSessionStorageOptions<T> = {}
): {
  sessionValue: T;
  setSessionValue: Dispatch<SetStateAction<T>>;
  removeSessionValue: () => void;
} {
  const { initializeWithValue = true } = options;

  const serializer = useCallback<(value: T) => string>(
    (value) => {
      if (options.serializer) {
        return options.serializer(value);
      }

      return JSON.stringify(value);
    },
    [options]
  );

  const deserializer = useCallback<(value: string) => T>(
    (value) => {
      if (options.deserializer) {
        return options.deserializer(value);
      }
      // Support 'undefined' as a value
      if (value === 'undefined') {
        return undefined as unknown as T;
      }

      const defaultValue = initialValue instanceof Function ? initialValue() : initialValue;

      let parsed: unknown;
      try {
        parsed = JSON.parse(value);
      } catch (error) {
        return defaultValue; // Return initialValue if parsing fails
      }

      return parsed as T;
    },
    [options, initialValue]
  );

  // Get from session storage then
  // parse stored json or return initialValue
  const readValue = useCallback((): T => {
    const initialValueToUse = initialValue instanceof Function ? initialValue() : initialValue;

    if (IS_SERVER) {
      return initialValueToUse;
    }

    try {
      const raw = window.sessionStorage.getItem(key);
      return raw ? deserializer(raw) : initialValueToUse;
    } catch (error) {
      return initialValueToUse;
    }
  }, [initialValue, key, deserializer]);

  const [storedValue, setStoredValue] = useState(() => {
    if (initializeWithValue) {
      return readValue();
    }

    return initialValue instanceof Function ? initialValue() : initialValue;
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to sessionStorage.
  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (value) => {
      // Prevent build error "window is undefined" but keeps working
      if (IS_SERVER) {
        throw new Error(`set sessionStorage key “${key}” in server environment`);
      }

      try {
        // Allow value to be a function so we have the same API as useState
        const newValue = value instanceof Function ? value(readValue()) : value;

        // Save to session storage
        window.sessionStorage.setItem(key, serializer(newValue));

        // Save state
        setStoredValue(newValue);

        // We dispatch a custom event so every similar useSessionStorage hook is notified
        window.dispatchEvent(new StorageEvent('session-storage', { key }));
      } catch (error) {
        throw new Error(`Error setting sessionStorage key “${key}”:`);
      }
    },
    [key, readValue, serializer]
  );

  const removeValue = useCallback(() => {
    // Prevent build error "window is undefined" but keeps working
    if (IS_SERVER) {
      throw new Error(`removing sessionStorage key “${key}” in no client environment`);
    }

    const defaultValue = initialValue instanceof Function ? initialValue() : initialValue;

    // Remove the key from session storage
    window.sessionStorage.removeItem(key);

    // Save state with default value
    setStoredValue(defaultValue);

    // We dispatch a custom event so every similar useSessionStorage hook is notified
    window.dispatchEvent(new StorageEvent('session-storage', { key }));
  }, [initialValue, key]);

  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const handleStorageChange = useCallback(
    (event: StorageEvent | CustomEvent) => {
      if ((event as StorageEvent).key && (event as StorageEvent).key !== key) {
        return;
      }
      setStoredValue(readValue());
    },
    [key, readValue]
  );

  useEffect(() => {
    const abortController = new AbortController();
    window.addEventListener('storage', handleStorageChange, { signal: abortController.signal });
    window.addEventListener('session-storage', handleStorageChange, {
      signal: abortController.signal,
    });

    return () => {
      abortController.abort();
    };
  }, [handleStorageChange]);

  return {
    sessionValue: storedValue,
    setSessionValue: setValue,
    removeSessionValue: removeValue,
  };
}
