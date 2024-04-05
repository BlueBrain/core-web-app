export interface InviteResponse {
  message: string;
  data: {
    virtual_lab_id: string;
    project_id?: string;
    origin: 'Lab' | 'Project';
  };
}

export interface InviteError {
  error_code: string;
  message: string;
  details: string | null;
}

export function isVlmResponse(response: any): response is InviteResponse {
  return response?.data?.origin && response?.data?.virtual_lab_id;
}

export function isInviteError(response: any): response is InviteError {
  return response?.error_code && response?.message;
}

export enum InviteErrorCodes {
  UNAUTHORIZED = 1,
  INVALID_LINK = 2,
  TOKEN_EXPIRED = 3,
  INVITE_ALREADY_ACCEPTED = 4,
  UNKNOWN = 5,
}
