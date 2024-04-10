import React from 'react';
import { usePathname } from 'next/navigation';
import { STEPS } from '../../constants';
import { Button } from '../Button';
import { Step } from './Step';
import { classNames } from '@/util/utils';

import styles from './nav-buttons.module.css';

export interface NavButtonsProps {
  className?: string;
  nextPage: string;
  step: keyof typeof STEPS;
  disabled?: boolean;
}

export function NavButtons({ className, nextPage, step, disabled }: NavButtonsProps) {
  const pathname = goto(usePathname(), nextPage);
  return (
    <div className={classNames(styles.main, className)}>
      <Button variant="text" href="/">
        Cancel
      </Button>
      {step === 'members' ? (
        <div>create</div>
      ) : (
        <Button href={pathname} disabled={disabled}>
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

function goto(path: string | null, page: string) {
  const parts = (path ?? '/').split('/');
  parts.pop();
  parts.push(page);
  return parts.join('/');
}
