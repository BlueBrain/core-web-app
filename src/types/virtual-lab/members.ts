export type MockRole = 'administrator' | 'member';

export type MockMember = {
  key: string;
  name: string;
  lastActive: string;
  role: MockRole;
};
