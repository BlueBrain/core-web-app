import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '../Button';
import { useCurrentVirtualLab } from '../../hooks/current-virtual-lab';
import { Step } from './Step';
import useNotification from '@/hooks/notifications';
import { classNames } from '@/util/utils';
import { createVirtualLab } from '@/services/virtual-lab/labs';

import styles from './nav-buttons.module.css';

export interface NavButtonsProps {
  className?: string;
  step: string;
  disabled?: boolean;
  onNext: () => void;
}

export function NavButtons({ className, step, disabled, onNext }: NavButtonsProps) {
  const session = useSession();
  const notification = useNotification();
  const [loading, setLoading] = useState(false);
  const [lab] = useCurrentVirtualLab();

  const handleCreate = async () => {
    if (!session.data) {
      return;
    }
    setLoading(true);

    return createVirtualLab({ lab, token: session.data.accessToken })
      .then((response) => {
        notification.success(`${response.data.virtual_lab.name} has been created.`);
        onNext();
      })
      .catch((error) => {
        notification.error(`Virtual Lab creation failed: ${error}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={classNames(styles.main, className)}>
      <Button variant="text" href="/">
        Cancel
      </Button>
      {step === 'members' ? (
        <Button onClick={handleCreate} disabled={disabled || loading}>
          {loading ? 'Creating...' : 'Create'}
        </Button>
      ) : (
        <Button onClick={onNext} disabled={disabled}>
          Next
        </Button>
      )}
      <hr />
      <div>{step}</div>
      <div>
        <Step selected={step === 'information'} />
        <Step selected={step === 'plan'} />
        <Step selected={step === 'members'} />
      </div>
    </div>
  );
}
