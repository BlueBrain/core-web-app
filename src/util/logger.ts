/**
 * @TODO: Use Sentry to log.
 */
export function logError(...args: unknown[]) {
  // Sentry.captureException(ex)
  // eslint-disable-next-line no-console
  console.error(...args);
}

/**
 * @TODO: Use Sentry to log.
 */
export function logInfo(...args: unknown[]) {
  // eslint-disable-next-line no-console
  console.info(...args);
}
