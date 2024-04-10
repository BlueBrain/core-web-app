import { VlmResponse } from './common';

export type InviteData = {
  virtual_lab_id: string;
  project_id?: string;
  origin: 'Lab' | 'Project';
  status?: string;
};

export type InviteResponse = VlmResponse<InviteData>;

export function isVlmInviteResponse(response: any): response is InviteResponse {
  return response?.data?.origin && response?.data?.virtual_lab_id;
}

export enum InviteErrorCodes {
  UNAUTHORIZED = 1,
  INVALID_LINK = 2,
  TOKEN_EXPIRED = 3,
  INVITE_ALREADY_ACCEPTED = 4,
  UNKNOWN = 5,
}
