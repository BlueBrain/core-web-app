import { captureException } from '@sentry/nextjs';

import { InviteData, InviteErrorCodes } from '@/types/virtual-lab/invites';
import { VlmError, isVlmError } from '@/types/virtual-lab/common';
import { basePath } from '@/config';

const errorPath = '/';
const projectPath = (labId: string, projectId: string) =>
  `${basePath}/virtual-lab/lab/${labId}/project/${projectId!}/home`;
const labPath = (labId: string) => `${basePath}/virtual-lab/lab/${labId}/lab`;

export const getLabUrl = (vlmData: InviteData): string => {
  const { status, virtual_lab_id: labId, origin } = vlmData;
  if (status === 'already_accepted') {
    return `${errorPath}?errorcode=${InviteErrorCodes.INVITE_ALREADY_ACCEPTED}&origin=${origin}&lab_id=${labId}`;
  }

  return `${labPath(labId)}?invite_accepted=true`;
};

export const getProjectUrl = (vlmData: InviteData): string => {
  const { status, virtual_lab_id: labId, project_id: projectId, origin } = vlmData;
  if (status === 'already_accepted') {
    return `${errorPath}?errorcode=${InviteErrorCodes.INVITE_ALREADY_ACCEPTED}&origin=${origin}&lab_id=${labId}&project_id=${projectId}`;
  }

  return `${projectPath(labId, projectId!)}?invite_accepted=true`;
};

export const getErrorUrl = (
  response: VlmError | any,
  accessToken?: string,
  inviteToken?: string | null
): string => {
  if (!accessToken) {
    return `${errorPath}?errorcode=${InviteErrorCodes.UNAUTHORIZED}`;
  }
  if (!inviteToken) {
    return `${errorPath}?errorcode=${InviteErrorCodes.INVALID_LINK}`;
  }
  if (isVlmError(response)) {
    captureException(new Error(`User invite could not be accepted because of VLM Error`), {
      extra: { vliError: response, invite: inviteToken },
    });

    if (response.error_code === 'AUTHORIZATION_ERROR') {
      return `${errorPath}?errorcode=${InviteErrorCodes.UNAUTHORIZED}`;
    }

    if (response.error_code === 'TOKEN_EXPIRED') {
      return `${errorPath}?errorcode=${InviteErrorCodes.TOKEN_EXPIRED}`;
    }
    return `${errorPath}?errorcode=${InviteErrorCodes.UNKNOWN}`;
  }

  captureException(new Error(`User invite could not be accepted because of Unknown error`), {
    extra: { error: response, invite: inviteToken },
  });

  return `${errorPath}?errorcode=${InviteErrorCodes.UNKNOWN}`;
};
