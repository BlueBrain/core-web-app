import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { LoadingOutlined } from '@ant-design/icons';

import { Button } from '@virtual-lab-create/sub-components/Button';
import { useCurrentVirtualLab } from '@virtual-lab-create/hooks/current-virtual-lab';
import VirtualLabService from '@/services/virtual-lab/virtual-lab-service';
import { logError } from '@/util/logger';
import useNotification from '@/hooks/notifications';

export interface CreateButtonProps {
  className?: string;
  disabled?: boolean;
}

export function CreateButton({ className, disabled }: CreateButtonProps) {
  const notif = useNotification();
  const session = useSession().data;
  const [lab, update] = useCurrentVirtualLab();
  const [busy, setBusy] = useState(false);
  const handleClick = () => {
    if (!session) return;

    setBusy(true);
    const service = new VirtualLabService();
    service
      .create(session.user, lab)
      .then((newLab) => {
        update(newLab);
        setBusy(false);
      })
      .catch((err) => {
        logError(err);
        const msg = err instanceof Error ? err.message : JSON.stringify(err);
        notif.error(`Unable to create this Virtual Lab!\n${msg}`);
        setBusy(false);
      });
  };
  return (
    <Button
      className={className}
      disabled={disabled || busy}
      variant="primary"
      onClick={handleClick}
    >
      {busy && <LoadingOutlined />}
      <div>Create Virtual Lab</div>
    </Button>
  );
}
