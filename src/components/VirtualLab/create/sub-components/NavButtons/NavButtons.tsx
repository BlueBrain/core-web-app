import React from 'react';
import { STEPS } from '../../constants';
import { Button } from '../Button';
import { Step } from './Step';
import { classNames } from '@/util/utils';

import styles from './nav-buttons.module.css';

export interface NavButtonsProps {
  className?: string;
  step: keyof typeof STEPS;
  disabled?: boolean;
  onNext: () => void;
}

export function NavButtons({ className, step, disabled, onNext }: NavButtonsProps) {
  return (
    <div className={classNames(styles.main, className)}>
      <Button variant="text" href="/">
        Cancel
      </Button>
      {step === 'members' ? (
        <div>create</div>
      ) : (
        <Button onClick={onNext} disabled={disabled}>
          Next
        </Button>
      )}
      <hr />
      <div>{STEPS[step]}</div>
      <div>
        <Step selected={step === 'information'} />
        <Step selected={step === 'plan'} />
        <Step selected={step === 'members'} />
      </div>
    </div>
  );
}
