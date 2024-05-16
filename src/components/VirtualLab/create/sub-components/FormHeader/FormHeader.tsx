import { Fragment } from 'react';
import { STEPS } from '@/components/VirtualLab/create/constants';
import styles from './form-header.module.scss';

export interface Props {
  currentStep: string;
}
export function FormHeader({ currentStep }: Props) {
  return (
    <div className={styles.header}>
      {STEPS.map((step, index) => (
        <Fragment key={step}>
          <span className={step === currentStep ? styles.activeStep : styles.inactiveStep}>
            {step}
          </span>
          {index < STEPS.length - 1 && <span className={styles.separator} />}
        </Fragment>
      ))}
    </div>
  );
}
