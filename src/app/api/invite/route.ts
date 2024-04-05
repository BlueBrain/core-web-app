import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import nextAuthMiddleware, { NextRequestWithAuth } from 'next-auth/middleware';
import { captureException } from '@sentry/nextjs';
import { authOptions } from '@/auth';

interface InviteResponse {
  message: string;
  data: {
    virtual_lab_id: string;
    project_id?: string;
    origin: 'Lab' | 'Project';
  };
}

export enum InviteErrorCodes {
  UNAUTHORIZED = 1,
  INVALID_LINK = 2,
  INVITE_ALREADY_ACCEPTED = 3,
  UNKNOWN = 4,
}

export async function GET(req: NextRequest) {
  // return NextResponse.redirect(new URL(`/?errorcode=4`, req.url));
  const session = await getServerSession(authOptions);
  if (!session) {
    return nextAuthMiddleware(req as NextRequestWithAuth);
  }
  const sessionToken = session.accessToken;
  if (!sessionToken) {
    return NextResponse.redirect(new URL(`/?errorcode=${InviteErrorCodes.UNAUTHORIZED}`, req.url));
  }
  const inviteToken = req.nextUrl.searchParams.get('token');

  if (!inviteToken) {
    return NextResponse.redirect(new URL(`/?errorcode=${InviteErrorCodes.INVALID_LINK}`, req.url));
  }

  try {
    const response = await processInvite(sessionToken, inviteToken);
    if (response.message.includes('already accepted')) {
      return NextResponse.redirect(
        new URL(`/?errorcode=${InviteErrorCodes.INVITE_ALREADY_ACCEPTED}`, req.url)
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
        return NextResponse.redirect(new URL(`/?errorcode=${InviteErrorCodes.UNKNOWN}`, req.url));
    }
  } catch (err: any) {
    captureException(
      new Error(`User ${session.user.username} could not accept invite ${inviteToken}`),
      { extra: err }
    );
    return NextResponse.redirect(new URL(`/?errorcode=${InviteErrorCodes.UNKNOWN}`, req.url));
  }
}

const processInvite = async (
  sessionToken: string,
  inviteToken: string
): Promise<InviteResponse> => {
  const testToken =
    'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJza2hnaTdjRWxFbEJzRFpnZXh1NGlvSzBNV081eGtQbWlXWENYang4eHVrIn0.eyJleHAiOjE3OTg2MjgwNjMsImlhdCI6MTcxMjMxNDQ2MywianRpIjoiNTczZDdiNzctNjc0MS00ZjVmLTgzMjAtZDcwOTgwYWYzZWU3IiwiaXNzIjoiaHR0cDovL2tleWNsb2FrOjgwODAvcmVhbG1zL29icC1yZWFsbSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJiMjhhOWVjMy0zMzU2LTQyM2UtYWM2Ny0yOGJjNTZjMDhmMmQiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJvYnBhcHAiLCJzZXNzaW9uX3N0YXRlIjoiMDg2ZmJkMDctMGUyOS00ZDAxLTljMWEtZTVmMzc5OWM2MDU0IiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInNpZCI6IjA4NmZiZDA3LTBlMjktNGQwMS05YzFhLWU1ZjM3OTljNjA1NCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoidGVzdC0yIHRlc3QtMiIsInByZWZlcnJlZF91c2VybmFtZSI6InRlc3QtMiIsImdpdmVuX25hbWUiOiJ0ZXN0LTIiLCJmYW1pbHlfbmFtZSI6InRlc3QtMiIsImVtYWlsIjoidGVzdC0yQHRlc3QuY29tIn0.kECD0DdHMy2l-tHVmXQMmo7SQoYdhLUwEXEm0VTpowIWgC1ns1I_w9TDCkqroYg7M_jXnLVoEdTjwfbPqhr8wM5eSgCdtCCE_HJMMrXj4x2grgi-Oct1rpbhqJHGy-aJVJsjSlp5w66kK0umOFaGJgdUOlCQhFfeFiBPV26wvopjGfZq1RJnE4312wDqZ3iLis_jA7bW4O8CMq9PC5lphTvv654r240XHB3y26JWxsiqGlfzvmVb1FL9YVmItsgqBVGeBSoUje0ycqm1kYO5ixorziK3jbsdkW4Jxuy-9lSmrcjZXAzKTwsS1YjB2bxtIHErZ96YgVCupngcHr7HHA';
  // TODO: Replace this with environment variable
  return fetch(`http://localhost:8000/invites?token=${inviteToken}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${testToken}`,
    },
  }).then<InviteResponse>((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  });
};
