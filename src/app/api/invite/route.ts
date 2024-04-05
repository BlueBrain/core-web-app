import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import nextAuthMiddleware, { NextRequestWithAuth } from 'next-auth/middleware';
import { captureException } from '@sentry/nextjs';
import { Session } from 'next-auth';
import { authOptions } from '@/auth';
import {
  InviteError,
  InviteErrorCodes,
  InviteResponse,
  isInviteError,
  isVlmResponse,
} from '@/types/virtual-lab/invites';

function getErrorUrl(
  response: InviteError | any,
  session: Session | null,
  inviteToken: string | null
): string {
  if (!session?.accessToken) {
    return `/invite?errorcode=${InviteErrorCodes.UNAUTHORIZED}`;
  }

  if (!inviteToken) {
    return `/invite?errorcode=${InviteErrorCodes.INVALID_LINK}`;
  }

  if (isInviteError(response)) {
    captureException(new Error(`User invite could not be accepted because of VLM Error`), {
      extra: { vliError: response, username: session?.user?.name, invite: inviteToken },
    });
    return response.message === 'Invite Token is not valid'
      ? `/invite?errorcode=${InviteErrorCodes.TOKEN_EXPIRED}`
      : `/invite?errorcode=${InviteErrorCodes.UNKNOWN}`;
  }

  captureException(new Error(`User invite could not be accepted because of Unknown error`), {
    extra: { error: response, username: session?.user?.name, invite: inviteToken },
  });
  return `/invite?errorcode=${InviteErrorCodes.UNKNOWN}`;
}

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

  if (!isVlmResponse(response)) {
    const url = getErrorUrl(response, session, inviteToken);
    return NextResponse.redirect(new URL(url, req.url));
  }

  if (response.message.includes('already accepted')) {
    return NextResponse.redirect(
      new URL(`/invite?errorcode=${InviteErrorCodes.INVITE_ALREADY_ACCEPTED}`, req.url)
    );
  }
  const { origin, virtual_lab_id: labId, project_id: projectId } = response.data;

  switch (origin) {
    case 'Lab':
      return NextResponse.redirect(new URL(`/virtual-lab/lab/${labId}/lab`, req.url));
    case 'Project':
      return NextResponse.redirect(
        new URL(`/virtual-lab/lab/${labId}/project/${projectId!}/home`, req.url)
      );
    default:
      captureException(
        new Error(
          `User ${session.user.username} could not accept invite ${inviteToken} because unknown origin returned by server`
        ),
        { extra: origin }
      );
      return NextResponse.redirect(
        new URL(`/invite?errorcode=${InviteErrorCodes.UNKNOWN}`, req.url)
      );
  }
}

const processInvite = async (
  sessionToken: string,
  inviteToken: string
): Promise<InviteResponse | InviteError> => {
  return fetch(`http://localhost:8000/invites?token=${inviteToken}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${sessionToken}`,
    },
  }).then<InviteResponse | InviteError>((response) => {
    return response.json();
  });
};
