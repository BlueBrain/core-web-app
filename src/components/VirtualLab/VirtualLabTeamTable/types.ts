export type Role = 'administrator' | 'member';

export type Member = {
  key: string;
  name: string;
  lastActive: string;
  role: Role;
};