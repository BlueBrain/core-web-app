import { isServer } from './config';
import { getClientSession } from './hooks/session';
import { retry } from './util/retry';

/**
  Gets the current session. 
  Works server and client side. 
*/
export async function getSession() {
  if (!isServer) return await getClientSession();

  const { auth } = await import('src/auth'); // Only import if running on server

  return await auth();
}

/**
  Adds Authorization header with the accessToken, and calls fetch.
  See fetch for call signature: https://developer.mozilla.org/fr/docs/Web/API/fetch
*/
async function authFetch(...args: Parameters<typeof fetch>): ReturnType<typeof fetch> {
  const session = await getSession();
  if (!session) return fetch(...args); // If no active session fetch, for use in unauthenticated routes

  const init = args[1] || {};
  const headers = new Headers(init.headers ?? {});
  if (!headers.has('Authorization'))
    headers.append('Authorization', `Bearer ${session.accessToken}`);

  init.headers = headers;

  const newArgs: typeof args = [args[0], init];
  return fetch(...newArgs); // If there is an active session set Authorization and fetch
}

export default retry()(authFetch); // Only retry on exceptions

export const authFetchRetryOnError = retry({
  shouldRetryOnError: (status: number) => status > 405,
})(authFetch); // Retry on exceptions or error statuses > 405
