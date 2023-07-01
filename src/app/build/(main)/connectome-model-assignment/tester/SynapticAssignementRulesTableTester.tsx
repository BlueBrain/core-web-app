import { useState } from 'react';
import SynapticAssignementRulesTable from '@/components/SynapticAssignementRulesTable';
import { useSynapticAssignementRules } from '@/components/SynapticAssignementRulesTable/hooks/synaptic-assignement-rules';

export default function SynapticAssignementRulesTableTester({
  readonly = false,
  mode = 'light',
}: {
  readonly?: boolean;
  mode?: 'dark' | 'light';
}) {
  const initialRules = useSynapticAssignementRules(readonly);
  const [rules, setRules] = useState(initialRules);
  return (
    <SynapticAssignementRulesTable
      editable={!readonly}
      rules={rules}
      onRulesChange={setRules}
      mode={mode}
    />
  );
}
