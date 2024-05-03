import { useState } from 'react';

import { useCurrentVirtualLab } from '../../hooks/current-virtual-lab';
import { Form } from '@/components/VirtualLab/create/sub-components/Form';
import { Layout } from '@/components/VirtualLab/create/sub-components/Layout';
import { Main } from '@/components/VirtualLab/create/sub-components/Main';
import { FieldType } from '@/components/VirtualLab/create/types';

export interface VirtualLabCreateInformationProps {
  className?: string;
}

export function VirtualLabCreateInformation({ className }: VirtualLabCreateInformationProps) {
  const [lab, updateLab] = useCurrentVirtualLab();
  const [valid, setValid] = useState(false);

  return (
    <Layout className={className}>
      <Main canGoNext={valid} step="information">
        <h2>Information</h2>
        <Form value={lab} onChange={updateLab} onValidityChange={setValid} fields={FIELDS} />
      </Main>
    </Layout>
  );
}

const FIELDS: Record<string, FieldType> = {
  name: { label: "Virtual lab's name", required: true, placeholder: "Enter your lab's name..." },
  description: { label: 'Description', placeholder: 'Enter your description...' },
  reference_email: {
    label: 'Reference email',
    type: 'email',
    required: true,
    placeholder: 'Enter an email here...',
  },
  entity: { label: 'Entity', required: true, placeholder: "Enter your entity's name..." },
};
