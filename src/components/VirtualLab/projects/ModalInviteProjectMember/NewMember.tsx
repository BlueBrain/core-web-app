import { useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';

import { Member } from './types';
import { isValidEMail } from './utils';
import { IconMail } from './IconMail';
import { RoleCombo } from './RoleCombo';
import useNotification from '@/hooks/notifications';

export function NewMember({
  onCancel,
  onOK,
}: {
  onCancel: () => void;
  onOK: (member: Member) => void;
}) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'member' | 'admin'>('member');
  const notif = useNotification();
  return (
    <div className="flex w-full flex-wrap items-center gap-4 whitespace-nowrap font-normal text-dark">
      <IconMail disabled />
      <b>Invitation to:</b>
      <input
        className="flex-1"
        placeholder="Enter email address..."
        value={email}
        onChange={(evt) => setEmail(evt.target.value)}
      />
      <b>As:</b>
      <RoleCombo role={role} onChange={setRole} />
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => {
            if (isValidEMail(email)) {
              onOK({
                email,
                role,
              });
            } else {
              notif.warning('The email address is not valid!');
            }
          }}
          aria-label="Confirm"
        >
          Confirm
        </button>
        <button type="button" onClick={onCancel} aria-label="Cancel">
          <CloseOutlined />
        </button>
      </div>
    </div>
  );
}
