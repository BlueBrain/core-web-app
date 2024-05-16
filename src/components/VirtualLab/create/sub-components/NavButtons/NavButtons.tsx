import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { Button } from '../Button';
import { useCurrentVirtualLab } from '../../hooks/current-virtual-lab';
import { Step } from './Step';
import useNotification from '@/hooks/notifications';
import { classNames } from '@/util/utils';
import { createVirtualLab } from '@/services/virtual-lab/labs';
import { useModalState } from '@/components/VirtualLab/create/contexts/ModalStateContext';
import { refreshAtom } from '@/state/virtual-lab/lab';
import styles from './nav-buttons.module.css';

export interface NavButtonsProps {
  className?: string;
  step: string;
  disabled?: boolean;
}

export function NavButtons({ className, step, disabled }: NavButtonsProps) {
  const { handleNext, handleCancel, setIsModalVisible } = useModalState();
  const session = useSession();
  const notification = useNotification();
  const [loading, setLoading] = useState(false);
  const [lab] = useCurrentVirtualLab();
  const refresh = useSetAtom(refreshAtom);

  const handleCreate = async () => {
    if (!session.data) {
      return;
    }
    setLoading(true);

    return createVirtualLab({ lab, token: session.data.accessToken })
      .then((response) => {
        notification.success(`${response.data.virtual_lab.name} has been created.`);
        refresh((count) => count + 1);
        handleNext();
        setIsModalVisible(false);
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
      <Button variant="text" onClick={handleCancel}>
        Cancel
      </Button>
      {step === 'plan' ? (
        <Button onClick={handleCreate} disabled={disabled || loading}>
          {loading ? 'Creating...' : 'Create'}
        </Button>
      ) : (
        <Button onClick={handleNext} disabled={disabled}>
          Next
        </Button>
      )}
      <hr />
      <div>{step}</div>
      <div>
        <Step selected={step === 'information'} />
        <Step selected={step === 'plan'} />
      </div>
    </div>
  );
}
