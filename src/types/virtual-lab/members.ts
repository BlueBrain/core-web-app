export type MockRole = 'administrator' | 'member';

export type MockMember = {
  key: string;
  name: string;
  lastActive: string;
  role: MockRole;
};
export interface VirtualLabMember {
  name: string;
  email: string;
  role: 'admin' | 'user';
  lastActive?: number;
}
