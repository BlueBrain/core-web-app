import { WritableAtom, atom, useAtom as useAtomJ, Atom } from 'jotai';
import { useContext, PropsWithChildren, useRef, createContext } from 'react';

const newMap = () => new Map<string, Atom<any>>();
const AtomContext = createContext(newMap());

export function AtomProvider({ children }: PropsWithChildren) {
  const atoms = useRef(newMap()).current;

  return <AtomContext.Provider value={atoms}>{children}</AtomContext.Provider>;
}

export function useInitAtom<T>(key: string, value: T | null = null) {
  const atoms = useContext(AtomContext);
  const theAtom = atoms.get(key) ?? atom(value);
  atoms.set(key, theAtom);

  return theAtom as WritableAtom<T | null, [T | null], void>;
}

export function useAtom<T>(key: string) {
  return useAtomJ(useInitAtom<T>(key));
}
