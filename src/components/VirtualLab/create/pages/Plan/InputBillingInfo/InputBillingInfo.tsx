import React from 'react';

import { COUNTRIES } from '../../../constants';
import { FieldType } from '../../../types';
import { Form } from '../../../sub-components/Form';
import { KeysOfType } from '@/util/typing';
import { classNames } from '@/util/utils';
import { MockBilling } from '@/types/virtual-lab/lab';
import styles from './input-billing-info.module.css';

export interface InputBillingInfoProps {
  className?: string;
  onValidityChange(validity: boolean): void;
}

export function InputBillingInfo({ className, onValidityChange }: InputBillingInfoProps) {
  const updateBilling = () => {};

  return (
    <div className={classNames(styles.main, className)}>
      <h1>Billing</h1>
      <section>
        <Form
          value={{}}
          onChange={updateBilling}
          onValidityChange={onValidityChange}
          fields={FIELDS}
        />
      </section>
    </div>
  );
}

const RX_NAME = '[\\p{L}].*';

const FIELDS: Record<KeysOfType<MockBilling, string>, FieldType> = {
  organization: {
    required: true,
    label: 'Organization',
    placeholder: 'Enter your organization...',
    title: 'Should start with a letter',
  },
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
