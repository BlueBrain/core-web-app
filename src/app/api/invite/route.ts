import { getServerSession } from 'next-auth/next';
import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import { captureException } from '@sentry/nextjs';
import { Session } from 'next-auth';
import { authOptions } from '@/auth';
import { InviteErrorCodes, InviteResponse, isVlmInviteResponse } from '@/types/virtual-lab/invites';
import { VlmError, isVlmError } from '@/types/virtual-lab/common';
import { basePath } from '@/config';

export async function GET(req: NextRequest): Promise<any> {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    redirect(getErrorUrl(null, session, null));
  }

  const inviteToken = req.nextUrl.searchParams.get('token');
  if (!inviteToken) {
    redirect(getErrorUrl(null, session, inviteToken ?? null));
    return;
  }

  const response = await processInvite(session?.accessToken, inviteToken);
  if (!isVlmInviteResponse(response)) {
    const url = getErrorUrl(response, session, inviteToken);
    redirect(url);
    return;
  }

  const { origin, status, virtual_lab_id: labId, project_id: projectId } = response.data;
  switch (origin) {
    case 'Lab':
      redirect(
        status === 'already_accepted'
          ? `${errorRedirectUrl}${InviteErrorCodes.INVITE_ALREADY_ACCEPTED}&origin=${origin}&lab_id=${labId}`
          : `${basePath}/virtual-lab/lab/${labId}/lab?invite_accepted=true`
      );
      break;
    case 'Project':
      redirect(
        status === 'already_accepted'
          ? `${errorRedirectUrl}${InviteErrorCodes.INVITE_ALREADY_ACCEPTED}&origin=${origin}&lab_id=${labId}&project_id=${projectId}`
          : `${basePath}/virtual-lab/lab/${labId}/project/${projectId!}/home?invite_accepted=true`
      );
      break;
    default:
      captureException(
        new Error(
          `User ${session.user.username} could not accept invite ${inviteToken} because unknown origin returned by server`
        ),
        { extra: origin }
      );
      redirect(`${errorRedirectUrl}${InviteErrorCodes.UNKNOWN}`);
  }
}

const errorRedirectUrl = `${basePath}/?errorcode=`;

const getErrorUrl = (
  response: VlmError | any,
  session: Session | null,
  inviteToken: string | null
): string => {
  if (!session?.accessToken) {
    return `${errorRedirectUrl}${InviteErrorCodes.UNAUTHORIZED}`;
  }

  if (!inviteToken) {
    return `${errorRedirectUrl}${InviteErrorCodes.INVALID_LINK}`;
  }

  if (isVlmError(response)) {
    captureException(new Error(`User invite could not be accepted because of VLM Error`), {
      extra: { vliError: response, username: session?.user?.name, invite: inviteToken },
    });
    if (response.error_code === 'AUTHORIZATION_ERROR') {
      return `${errorRedirectUrl}${InviteErrorCodes.UNAUTHORIZED}`;
    }

    if (response.error_code === 'TOKEN_EXPIRED') {
      return `${errorRedirectUrl}${InviteErrorCodes.TOKEN_EXPIRED}`;
    }

    return `${errorRedirectUrl}${InviteErrorCodes.UNKNOWN}`;
  }

  captureException(new Error(`User invite could not be accepted because of Unknown error`), {
    extra: { error: response, username: session?.user?.name, invite: inviteToken },
  });
  return `${errorRedirectUrl}${InviteErrorCodes.UNKNOWN}`;
};

const processInvite = async (
  sessionToken: string,
  inviteToken: string
): Promise<InviteResponse | VlmError> => {
  return fetch(`https://bbp.epfl.ch/vlm/invites?token=${inviteToken}`, {
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
      // eslint-disable-next-line no-console
      console.error(err);
      captureException(
        new Error(`User could not accept invite ${inviteToken} because of an unknown error`)
      );
      return { error_code: 'INTERNAL_SERVER_ERROR', message: 'Vlm server is down' } as VlmError;
    });
};
