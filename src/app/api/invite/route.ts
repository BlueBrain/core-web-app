import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import nextAuthMiddleware, { NextRequestWithAuth } from 'next-auth/middleware';
import { captureException } from '@sentry/nextjs';
import { Session } from 'next-auth';
import { authOptions } from '@/auth';
import { InviteErrorCodes, InviteResponse, isVlmInviteResponse } from '@/types/virtual-lab/invites';
import { VlmError, isVlmError } from '@/types/virtual-lab/common';

export async function GET(req: NextRequest): Promise<any> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return nextAuthMiddleware(req as NextRequestWithAuth);
  }
  if (!session.accessToken) {
    return NextResponse.redirect(new URL(getErrorUrl(null, session, null), req.url));
  }

  const inviteToken = req.nextUrl.searchParams.get('token');
  if (!inviteToken) {
    return NextResponse.redirect(new URL(getErrorUrl(null, session, inviteToken ?? null), req.url));
  }

  const response = await processInvite(session.accessToken, inviteToken);
  if (!isVlmInviteResponse(response)) {
    const url = getErrorUrl(response, session, inviteToken);
    return NextResponse.redirect(new URL(url, req.url));
  }

  const { origin, status, virtual_lab_id: labId, project_id: projectId } = response.data;
  switch (origin) {
    case 'Lab':
      return NextResponse.redirect(
        new URL(
          status === 'already_accepted'
            ? `${baseRedirectUrl}${InviteErrorCodes.INVITE_ALREADY_ACCEPTED}&origin=${origin}&lab_id=${labId}`
            : `/virtual-lab/lab/${labId}/lab?invite_accepted=true`,
          req.url
        )
      );
    case 'Project':
      return NextResponse.redirect(
        new URL(
          status === 'already_accepted'
            ? `${baseRedirectUrl}${InviteErrorCodes.INVITE_ALREADY_ACCEPTED}&origin=${origin}&lab_id=${labId}&project_id=${projectId}`
            : `/virtual-lab/lab/${labId}/project/${projectId!}/home?invite_accepted=true`,
          req.url
        )
      );
    default:
      captureException(
        new Error(
          `User ${session.user.username} could not accept invite ${inviteToken} because unknown origin returned by server`
        ),
        { extra: origin }
      );
      return NextResponse.redirect(
        new URL(`${baseRedirectUrl}${InviteErrorCodes.UNKNOWN}`, req.url)
      );
  }
}

const baseRedirectUrl = '/?errorcode=';

const getErrorUrl = (
  response: VlmError | any,
  session: Session | null,
  inviteToken: string | null
): string => {
  if (!session?.accessToken) {
    return `${baseRedirectUrl}${InviteErrorCodes.UNAUTHORIZED}`;
  }

  if (!inviteToken) {
    return `${baseRedirectUrl}${InviteErrorCodes.INVALID_LINK}`;
  }

  if (isVlmError(response)) {
    captureException(new Error(`User invite could not be accepted because of VLM Error`), {
      extra: { vliError: response, username: session?.user?.name, invite: inviteToken },
    });
    if (response.error_code === 'AUTHORIZATION_ERROR') {
      return `${baseRedirectUrl}${InviteErrorCodes.UNAUTHORIZED}`;
    }

    if (response.error_code === 'TOKEN_EXPIRED') {
      return `${baseRedirectUrl}${InviteErrorCodes.TOKEN_EXPIRED}`;
    }

    return `${baseRedirectUrl}${InviteErrorCodes.UNKNOWN}`;
  }

  captureException(new Error(`User invite could not be accepted because of Unknown error`), {
    extra: { error: response, username: session?.user?.name, invite: inviteToken },
  });
  return `${baseRedirectUrl}${InviteErrorCodes.UNKNOWN}`;
};

const processInvite = async (
  sessionToken: string,
  inviteToken: string
): Promise<InviteResponse | VlmError> => {
  return fetch(`http://localhost:8000/invites?token=${inviteToken}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${sessionToken}`,
    },
  }).then<InviteResponse | VlmError>((response) => {
    return response.json();
  });
};
