import { useAtomValue } from 'jotai';

import { eModelAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';

export default function EModelTitle() {
  const eModel = useAtomValue(eModelAtom);

  if (!eModel) return null;

  return <div className="text-3xl font-bold text-primary-8">{eModel.name}</div>;
}
