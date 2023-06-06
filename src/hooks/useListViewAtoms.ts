import { useAtomValue, useSetAtom } from 'jotai';
import { ListViewAtomValues, ListViewAtomSetters } from '@/types/explore-section';

export function useListViewAtoms({ ...atoms }) {
  return Object.entries(atoms).reduce((acc, [key, atom]) => {
    const atomValue = useAtomValue(atom); // eslint-disable-line react-hooks/rules-of-hooks

    return { ...acc, [key]: atomValue };
  }, {} as ListViewAtomValues);
}

export function useSetListViewAtoms({ ...atoms }) {
  return Object.entries(atoms).reduce((acc, [key, atom]) => {
    const setAtom = useSetAtom(atom); // eslint-disable-line react-hooks/rules-of-hooks

    return { ...acc, [key]: setAtom };
  }, {} as ListViewAtomSetters);
}
