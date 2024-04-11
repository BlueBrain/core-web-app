import { virtualLabApi } from '@/config';
import { VirtualLab } from '@/types/virtual-lab/lab';
import { VirtualLabAPIListResponse, VirtualLabAPIResponse } from '@/types/virtual-lab/api';
import { Project } from '@/types/virtual-lab/projects';

// Add the bearer token from the frontend below
// This constant will be replaced by the actual login token as soon as login is implemented
const accessToken =
  'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJza2hnaTdjRWxFbEJzRFpnZXh1NGlvSzBNV081eGtQbWlXWENYang4eHVrIn0.eyJleHAiOjE3OTkxNDg2NjQsImlhdCI6MTcxMjgzNTA2NCwianRpIjoiNmVmYmZkY2UtZmVjOS00Y2Y2LWE0OWQtMzhhYmQyOWVkMzJjIiwiaXNzIjoiaHR0cDovL2tleWNsb2FrOjgwODAvcmVhbG1zL29icC1yZWFsbSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIzYmE3MWNjZi1hNjIzLTQ1YjAtYTg1My0zYTNlYTUxZWZiY2QiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJvYnBhcHAiLCJzZXNzaW9uX3N0YXRlIjoiYThhOGMxNWYtMWVkNy00ZjhmLThjYTgtYjM5ODhiNjczODRkIiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInNpZCI6ImE4YThjMTVmLTFlZDctNGY4Zi04Y2E4LWIzOTg4YjY3Mzg0ZCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoidGVzdCB0ZXN0IiwicHJlZmVycmVkX3VzZXJuYW1lIjoidGVzdCIsImdpdmVuX25hbWUiOiJ0ZXN0IiwiZmFtaWx5X25hbWUiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIn0.WleEYbDtgD108SFsDAKFZYraLjxDxgulZnjUD4cZ4fI1_5NJoo1iYnnI14yL0UZNy7robNzQEQN-xCwhXPYnYHIOWg7cRv1DbfNRLcY9hWRgiMNjQkwxmRJ4gl9LwoZrxrzaaAjGXY96lXqxuTjZfLfGcxwPMu0uN6PcX7r9BTUrm4nX_nEdgkFLss4gHnVWSE6-quqxOd7dlhJAn3o96Qh4WG-n_e0L1DbGs9-TvQbHNHQUFn5C4h9wpL_LW2VMPbPqyuS6mqDXIINl0yBARkUdq548eKRF37d4rMuk5p8yDnBqq-Fv-hbVfDj-MGOEYIzdzwiInv6uSjht-nqqwQ';

export async function getVirtualLabDetail(id: string): Promise<VirtualLabAPIResponse> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs/${id}`, {
    method: 'GET',
    headers: { Authorization: accessToken, accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function getVirtualLabsOfUser(): Promise<VirtualLabAPIListResponse<VirtualLab>> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs`, {
    method: 'GET',
    headers: { Authorization: accessToken, accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function getVirtualLabProjects(
  id: string
): Promise<VirtualLabAPIListResponse<Project>> {
  const response = await fetch(`${virtualLabApi.url}/virtual-labs/${id}/projects`, {
    method: 'GET',
    headers: { Authorization: accessToken, accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}
