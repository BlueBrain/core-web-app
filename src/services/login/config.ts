const KEYCLOAK_BASE_URL = 'https://bbpauth.epfl.ch/auth/realms/BBP/protocol/openid-connect';

export const KEYCLOAK_AUTH_URL = `${KEYCLOAK_BASE_URL}/auth`;
export const KEYCLOAK_TOKEN_URL = `${KEYCLOAK_BASE_URL}/token`;
export const KEYCLOAK_USERINFO_URL = `${KEYCLOAK_BASE_URL}/userinfo`;
export const CLIENT_ID = 'bbp-sbo-application';
