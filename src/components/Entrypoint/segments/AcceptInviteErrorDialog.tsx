'use client';

import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { InviteErrorCodes } from '@/types/virtual-lab/invites';

const getInviteErrorMessage = (code?: string): string => {
  try {
    const errorCode = Number(code);
    switch (errorCode) {
      case InviteErrorCodes.UNAUTHORIZED:
        return 'Please make sure you are signed in.';
      case InviteErrorCodes.TOKEN_EXPIRED:
        return 'The invite link has expired.';
      case InviteErrorCodes.INVALID_LINK:
        return 'Invite link is invalid.';
      case InviteErrorCodes.INVITE_ALREADY_ACCEPTED:
        return 'This invite is already accepted.';
      case InviteErrorCodes.UNKNOWN:
      default:
        return 'Invitation could not be accepted due to an unknown error';
    }
  } catch {
    return 'Invitation could not be accepted due to an unknown error';
  }
};

export default function AcceptInviteErrorDialog({ errorCode }: { errorCode: string }) {
  // This is needed to prevent hydration errors.
  // The Dialog is not rendered correctly on server side, so we need to prevent it from rendering until the client side hydration is complete (and `useEffect` is run).
  // https://github.com/vercel/next.js/discussions/35773
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <Modal open={open} onCancel={() => setOpen(false)} footer={null}>
      {getInviteErrorMessage(errorCode)}
    </Modal>
  );
}
