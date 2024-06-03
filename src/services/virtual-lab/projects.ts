import { createApiHeaders } from './common';
import { virtualLabApi } from '@/config';
import { Project, ProjectResponse } from '@/types/virtual-lab/projects';
import { VirtualLabAPIListData, VlmResponse } from '@/types/virtual-lab/common';
import { UsersResponse } from '@/types/virtual-lab/members';
import { fetchWithSession } from '@/util/utils';

export async function getVirtualLabProjects(
  id: string
): Promise<VlmResponse<VirtualLabAPIListData<Project>>> {
  const response = await fetchWithSession(`${virtualLabApi.url}/virtual-labs/${id}/projects`);
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function getVirtualLabProjectDetails(
  virtualLabId: string,
  projectId: string,
  token: string
): Promise<ProjectResponse> {
  const response = await fetch(
    `${virtualLabApi.url}/virtual-labs/${virtualLabId}/projects/${projectId}`,
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
    token,
    includeMembers,
  }: {
    name: string;
    description: string;
    includeMembers: { email: string; role: 'admin' | 'member' }[];
    token: string;
  },
  virtualLabId: string
): Promise<VlmResponse<{ project: Project }>> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs/${virtualLabId}/projects`, {
    method: 'POST',
    headers: { ...createApiHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      description,
      include_members: includeMembers,
    }),
  });

  if (response.ok) {
    return response.json();
  }

  if (response.status === 400) {
    const { message } = await response.json();

    throw new Error(message);
  }

  throw new Error(`Undocumented error, ${response.status}`);
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

  if (response.ok) {
    return response.json();
  }

  if (response.status === 400) {
    const { message } = await response.json();

    throw new Error(message);
  }

  throw new Error(`Undocumented error, ${response.status}`);
}
