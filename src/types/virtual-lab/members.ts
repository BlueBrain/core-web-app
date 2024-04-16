import { VlmResponse } from './common';

export type MockRole = 'administrator' | 'member';

export type Role = 'admin' | 'member';

export type MockMember = {
  key: string;
  name: string;
  lastActive: string;
  role: MockRole;
};
export interface VirtualLabMember {
  id: string;
  username: string;
  created_at: string;
  first_name: string;
  last_name: string;
  invite_accepted: boolean;
  role: Role;
  name: string;
}

export type UsersResponse = VlmResponse<{ users: VirtualLabMember[] }>;
