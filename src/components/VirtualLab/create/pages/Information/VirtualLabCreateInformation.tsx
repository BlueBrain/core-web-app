import { useState } from 'react';

import { useCurrentVirtualLab } from '../../hooks/current-virtual-lab';
import { Form } from '../../sub-components/Form';
import { Layout } from '../../sub-components/Layout';
import { Main } from '../../sub-components/Main';
import { FieldType } from '../../types';

export interface VirtualLabCreateInformationProps {
  className?: string;
  nextPage: string;
}

export function VirtualLabCreateInformation({
  className,
  nextPage,
}: VirtualLabCreateInformationProps) {
  const [lab, updateLab] = useCurrentVirtualLab();
  const [valid, setValid] = useState(false);
  return (
    <Layout className={className}>
      <Main nextPage={nextPage} canGoNext={valid} step="information">
        <h2>Information</h2>
        <Form value={lab} onChange={updateLab} onValidityChange={setValid} fields={FIELDS} />
      </Main>
    </Layout>
  );
}

const FIELDS: Record<string, FieldType> = {
  name: { label: "Virtual lab's name", required: true, placeholder: "Enter your lab's name..." },
  description: { label: 'Description', placeholder: 'Enter your description...' },
  referenceEMail: {
    label: 'Reference email',
    type: 'email',
    required: true,
    placeholder: 'Enter an email here...',
  },
};
