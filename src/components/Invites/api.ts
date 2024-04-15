import { captureException } from '@sentry/nextjs';

import { InviteResponse } from '@/types/virtual-lab/invites';
import { VlmError } from '@/types/virtual-lab/common';
import { virtualLabApi } from '@/config';

export const processInvite = async (
  sessionToken: string,
  inviteToken: string
): Promise<InviteResponse | VlmError> => {
  return fetch(`${virtualLabApi.url}/invites?token=${inviteToken}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${sessionToken}`,
    },
  })
    .then<InviteResponse | VlmError>((response) => {
      // Valid response or client errors (40X)
      return response.json();
    })
    .catch((err) => {
      // Server errors (50X)
      captureException(
        new Error(`User could not accept invite ${inviteToken} because of an unknown error`),
        { extra: err }
      );
      return { error_code: 'INTERNAL_SERVER_ERROR', message: 'Vlm server is down' } as VlmError;
    });
};
