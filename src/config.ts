export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const isServer = typeof window === 'undefined';

export const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

export const keycloak = {
  issuer: process.env.KEYCLOAK_ISSUER,
  clientId: process.env.KEYCLOAK_CLIENT_ID as string,
  clientSecret: process.env.KEYCLOAK_CLIENT_SECRET as string,
};

const ORG = 'bbp';
const PROJECT = 'mmb-point-neuron-framework-model';

export const nexus = {
  url: process.env.NEXT_PUBLIC_NEXUS_URL ?? 'https://bbp.epfl.ch/nexus/v1',
  aiUrl: process.env.NEXT_PUBLIC_BBS_ML_URL ?? 'https://ml.bbs.master.kcp.bbp.epfl.ch',
  org: ORG,
  project: PROJECT,
  defaultIdBaseUrl: `https://bbp.epfl.ch/data/${ORG}/${PROJECT}`,
  legacyIdBaseUrl: 'https://bbp.epfl.ch/neurosciencegraph/data/modelconfigurations',
  defaultESIndexId: 'https://bbp.epfl.ch/neurosciencegraph/data/views/es/dataset',
  defaultContext: 'https://bbp.neuroshapes.org',
};

export const autoSaveDebounceInterval = 10000;
