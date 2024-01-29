import { COUNTRIES } from '@virtual-lab-create/constants';
import { useCurrentVirtualLab } from '@virtual-lab-create/hooks/current-virtual-lab';
import { FieldType } from '@virtual-lab-create/types';
import { Form } from '@virtual-lab-create/sub-components/Form';
import { KeysOfType } from '@/util/typing';
import { classNames } from '@/util/utils';
import { VirtualLab } from '@/services/virtual-lab/types';

import styles from './input-billing-info.module.css';

export interface InputBillingInfoProps {
  className?: string;
  onValidityChange(validity: boolean): void;
}

export function InputBillingInfo({ className, onValidityChange }: InputBillingInfoProps) {
  const [lab, updateLab] = useCurrentVirtualLab();
  const { billing } = lab;
  const updateBilling = (partialBilling: Partial<VirtualLab['billing']>) => {
    updateLab({
      billing: {
        ...lab.billing,
        ...partialBilling,
      },
    });
  };
  if (!lab.plan || lab.plan === 'entry') return null;

  return (
    <div className={classNames(styles.main, className)}>
      <h1>Billing</h1>
      <section>
        <Form
          value={billing}
          onChange={updateBilling}
          onValidityChange={onValidityChange}
          fields={FIELDS}
        />
      </section>
    </div>
  );
}

const RX_NAME = '[\\p{L}].*';

const FIELDS: Record<KeysOfType<VirtualLab['billing'], string>, FieldType> = {
  firstname: {
    required: true,
    label: 'First name',
    placeholder: 'Enter your first name...',
    pattern: RX_NAME,
    title: 'Should start with a letter',
  },
  lastname: {
    required: true,
    label: 'Last name',
    placeholder: 'Enter your last name...',
    pattern: RX_NAME,
    title: 'Should start with a letter',
  },
  address: { required: true, label: 'Address', placeholder: 'Enter your address...' },
  city: { required: true, label: 'City', placeholder: 'Enter your city...' },
  postalCode: { required: true, label: 'Postal code', placeholder: 'Enter your postal code...' },
  country: {
    required: true,
    label: 'Country',
    placeholder: 'Enter your country...',
    options: COUNTRIES,
  },
};
