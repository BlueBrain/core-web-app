export const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

export const isServer = typeof window === 'undefined';

export const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

export const keycloak = {
  issuer: process.env.KEYCLOAK_ISSUER,
  clientId: process.env.KEYCLOAK_CLIENT_ID as string,
  clientSecret: process.env.KEYCLOAK_CLIENT_SECRET as string,
};

export const nexus = {
  url: process.env.NEXT_PUBLIC_NEXUS_URL ?? 'https://bbp.epfl.ch/nexus/v1',
  org: 'bbp',
  project: 'mmb-point-neuron-framework-model',
  defaultIdBaseUrl: 'https://bbp.epfl.ch/neurosciencegraph/data/modelconfigurations',
  defaultESIndexId: 'https://bbp.epfl.ch/neurosciencegraph/data/views/es/dataset',
  defaultContext: 'https://bbp.neuroshapes.org',
};

export const autoSaveDebounceInterval = 10000;
