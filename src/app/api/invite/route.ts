/* eslint-disable no-param-reassign */
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';
import { Session } from 'next-auth';
import { NextURL } from 'next/dist/server/web/next-url';
import { authOptions } from '@/auth';
import {
  InviteData,
  InviteErrorCodes,
  InviteResponse,
  isVlmInviteResponse,
} from '@/types/virtual-lab/invites';
import { VlmError, isVlmError } from '@/types/virtual-lab/common';

const errorPath = '/';
const projectPath = (labId: string, projectId: string) =>
  `/virtual-lab/lab/${labId}/project/${projectId!}/home`;
const labPath = (labId: string) => `/virtual-lab/lab/${labId}/lab`;

export async function GET(req: NextRequest): Promise<any> {
  const inviteToken = req.nextUrl.searchParams.get('token');
  const url = req.nextUrl.clone();

  // eslint-disable-next-line no-console
  console.log('URL basepath when request is received', url);

  url.searchParams.delete('token');

  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.redirect(getErrorUrl(url, null, session, null));
  }

  if (!inviteToken) {
    return NextResponse.redirect(getErrorUrl(url, null, session, inviteToken ?? null));
  }

  const response = await processInvite(session?.accessToken, inviteToken);
  if (!isVlmInviteResponse(response)) {
    return NextResponse.redirect(getErrorUrl(url, response, session, inviteToken));
  }

  switch (response.data.origin) {
    case 'Lab':
      return NextResponse.redirect(getLabUrl(url, response.data));
    case 'Project':
      return NextResponse.redirect(getProjectUrl(url, response.data));
    default:
      captureException(
        new Error(
          `User ${session.user.username} could not accept invite ${inviteToken} because unknown origin returned by server`
        ),
        { extra: response.data.origin }
      );
      return NextResponse.redirect(getErrorUrl(url, response, session, inviteToken));
  }
}

const getProjectUrl = (url: NextURL, vlmData: InviteData): NextURL => {
  const { status, virtual_lab_id: labId, project_id: projectId, origin } = vlmData;
  if (status === 'already_accepted') {
    url.pathname = errorPath;
    url.searchParams.set('errorcode', `${InviteErrorCodes.INVITE_ALREADY_ACCEPTED}`);
    url.searchParams.set('origin', origin);
    url.searchParams.set('lab_id', labId);
    url.searchParams.set('project_id', projectId!);
    return url;
  }

  url.pathname = projectPath(labId, projectId!);
  url.searchParams.set('invite_accepted', 'true');
  return url;
};

const getLabUrl = (url: NextURL, vlmData: InviteData): NextURL => {
  const { status, virtual_lab_id: labId, origin } = vlmData;
  if (status === 'already_accepted') {
    url.pathname = errorPath;
    url.searchParams.set('errorcode', `${InviteErrorCodes.INVITE_ALREADY_ACCEPTED}`);
    url.searchParams.set('origin', origin);
    url.searchParams.set('lab_id', labId);
    return url;
  }

  url.pathname = labPath(labId);
  url.searchParams.set('invite_accepted', 'true');
  return url;
};

const getErrorUrl = (
  url: NextURL,
  response: VlmError | any,
  session: Session | null,
  inviteToken: string | null
): NextURL => {
  url.pathname = errorPath;

  if (!session?.accessToken) {
    url.searchParams.set('errorcode', `${InviteErrorCodes.UNAUTHORIZED}`);
    return url;
  }

  if (!inviteToken) {
    url.searchParams.set('errorcode', `${InviteErrorCodes.INVALID_LINK}`);
    return url;
  }

  if (isVlmError(response)) {
    captureException(new Error(`User invite could not be accepted because of VLM Error`), {
      extra: { vliError: response, username: session?.user?.name, invite: inviteToken },
    });
    if (response.error_code === 'AUTHORIZATION_ERROR') {
      url.searchParams.set('errorcode', `${InviteErrorCodes.UNAUTHORIZED}`);
      return url;
    }

    if (response.error_code === 'TOKEN_EXPIRED') {
      url.searchParams.set('errorcode', `${InviteErrorCodes.TOKEN_EXPIRED}`);
      return url;
    }

    // eslint-disable-next-line no-console
    console.log('URL basepath at time of redirection', url);
    url.searchParams.set('errorcode', `${InviteErrorCodes.UNKNOWN}`);
    return url;
  }

  captureException(new Error(`User invite could not be accepted because of Unknown error`), {
    extra: { error: response, username: session?.user?.name, invite: inviteToken },
  });

  url.searchParams.set('errorcode', `${InviteErrorCodes.UNKNOWN}`);
  return url;
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
