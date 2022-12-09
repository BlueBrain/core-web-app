export const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

export const isServer = typeof window === 'undefined';

export const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

export const keycloakIssuer = process.env.KEYCLOAK_ISSUER;
export const keycloakClientId = process.env.KEYCLOAK_CLIENT_ID as string;
