import { useAtom } from 'jotai';
import { ListViewAtoms, ListViewAtomValues } from '@/types/explore-section/application';

export function useListViewAtoms({ ...atoms }) {
  return Object.entries(atoms).reduce(
    (acc, [key, atom]) => ({
      ...acc,
      [key]: useAtom(atom), // eslint-disable-line react-hooks/rules-of-hooks
    }),
    {} as ListViewAtoms<ListViewAtomValues>
  );
}
