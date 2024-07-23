import { createApiHeaders } from './common';
import { virtualLabApi } from '@/config';
import { Project, ProjectResponse } from '@/types/virtual-lab/projects';
import { VirtualLabAPIListData, VlmResponse } from '@/types/virtual-lab/common';
import { UsersResponse } from '@/types/virtual-lab/members';
import authFetch from '@/authFetch';
import { assertVLApiResponse } from '@/util/utils';

export async function getVirtualLabProjects(
  id: string,
  size?: number
): Promise<VlmResponse<VirtualLabAPIListData<Project>>> {
  const url = new URL(`${virtualLabApi.url}/virtual-labs/${id}/projects`);
  if (size) {
    const params = new URLSearchParams(url.search);
    params.set('size', `${size}`);
    url.search = params.toString();
  }

  const response = await authFetch(url);
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function getVirtualLabProjectDetails(
  virtualLabId: string,
  projectId: string
): Promise<ProjectResponse> {
  const response = await authFetch(
    `${virtualLabApi.url}/virtual-labs/${virtualLabId}/projects/${projectId}`
  );

  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }

  return response.json();
}

export async function getVirtualLabProjectUsers(
  virtualLabId: string,
  projectId: string,
  token: string
): Promise<UsersResponse> {
  const response = await fetch(
    `${virtualLabApi.url}/virtual-labs/${virtualLabId}/projects/${projectId}/users`,
    {
      method: 'GET',
      headers: createApiHeaders(token),
    }
  );
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function getUsersProjects(
  token: string
): Promise<VlmResponse<VirtualLabAPIListData<Project>>> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs/projects`, {
    method: 'GET',
    headers: createApiHeaders(token),
  });
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }

  return response.json();
}

export async function createProject(
  {
    name,
    description,
    includeMembers,
  }: {
    name: string;
    description: string;
    includeMembers: { email: string; role: 'admin' | 'member' }[];
  },
  virtualLabId: string
): Promise<VlmResponse<{ project: Project }>> {
  const response = await authFetch(`${virtualLabApi.url}/virtual-labs/${virtualLabId}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      description,
      include_members: includeMembers,
    }),
  });

  return assertVLApiResponse(response);
}

export async function inviteUser({
  virtualLabId,
  projectId,
  email,
  role,
  token,
}: {
  virtualLabId: string;
  projectId: string;
  email: string;
  role: 'admin' | 'member';
  token: string;
}): Promise<VlmResponse<{ project: Project }>> {
  const response = await fetch(
    `${virtualLabApi.url}/virtual-labs/${virtualLabId}/projects/${projectId}/invites`,
    {
      method: 'POST',
      headers: { ...createApiHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        role,
      }),
    }
  );

  return assertVLApiResponse(response);
}

export async function patchProject(
  formData: Partial<Project>,
  virtualLabId: string,
  projectId: string
): Promise<
  VlmResponse<{
    project: Project;
  }>
> {
  return authFetch(`${virtualLabApi.url}/virtual-labs/${virtualLabId}/projects/${projectId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  }).then(async (response) => {
    if (!response.ok) {
      const { details, message } = await response.json();

      throw new Error(message, { cause: details });
    }

    return response.json();
  });
}
