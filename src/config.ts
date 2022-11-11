export const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

export const isServer = typeof window === 'undefined';

export const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
