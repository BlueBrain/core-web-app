'use client';

import { useAtomValue } from 'jotai';
import { initialRulesAtom } from './state';

export default function ConnectomeModelAssignmentView() {
  const initialRules = useAtomValue(initialRulesAtom);

  return (
    <div className="p-4">
      <h3>Connectome model assignment</h3>
    </div>
  );
}
