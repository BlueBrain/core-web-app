import { WritableAtom, Atom, atom, useAtomValue } from 'jotai';

const atoms: Map<string, Atom<any>> = new Map();

export function initAtom<T>(key: string, value: T | null = null) {
  const theAtom = atoms.get(key) ?? atom(value);
  atoms.set(key, theAtom);
  return theAtom as WritableAtom<T | null, [T | null], void>;
}

export function getAtom<T>(key: string) {
  return initAtom<T>(key);
}

export function useAssertAtomInitialized<T>(key: string) {
  useAssertAtomValue<T>(key);
  return getAtom<T>(key);
}

export function useAssertAtomValue<T>(key: string) {
  const v = useAtomValue(getAtom(key));
  if (v === null) throw new Error(`Atom with key ${key} not initialized`);
  return v as T;
}
