import { useEffect, SetStateAction } from 'react';
import { useAtom, useSetAtom, PrimitiveAtom, WritableAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { Filter } from '@/components/Filter/types';

type Props = {
  typeAtom: PrimitiveAtom<string | undefined>;
  triggerRefetchAtom: WritableAtom<null, [], Promise<void>> & any;
  filtersAtom: WritableAtom<Filter[], [any | SetStateAction<Filter[]>], void>;
  TYPE: string;
};

export default function useListPage({ typeAtom, triggerRefetchAtom, filtersAtom, TYPE }: Props) {
  const [type, setType] = useAtom(typeAtom);
  const refetch = useSetAtom(triggerRefetchAtom);
  const resetFilters = useResetAtom(filtersAtom);

  useEffect(() => {
    if (type !== TYPE) resetFilters();
    setType(TYPE);
    refetch();
  }, [setType, refetch, resetFilters, type, TYPE]);
}
