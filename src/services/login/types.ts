import { isNumber, isObject, isString } from '@/util/type-guards';
/* eslint-disable @typescript-eslint/naming-convention */

export interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
  session_state: string;
  scope: string;
}

export interface UserInfo {
  email: string;
  name: string;
}

export function isKeycloakTokenResponse(data: unknown): data is KeycloakTokenResponse {
  if (!isObject(data)) return false;
  const {
    access_token,
    expires_in,
    refresh_expires_in,
    refresh_token,
    token_type,
    id_token,
    session_state,
    scope,
  } = data;
  return (
    isString(access_token) &&
    isNumber(expires_in) &&
    isNumber(refresh_expires_in) &&
    isString(refresh_token) &&
    isString(token_type) &&
    isString(id_token) &&
    isString(session_state) &&
    isString(scope)
  );
}

export function isUserInfo(data: unknown): data is UserInfo {
  if (!isObject(data)) return false;
  const { name, email } = data;
  return isString(name) && isString(email);
}
