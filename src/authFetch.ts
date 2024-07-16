import { isServer } from './config';
import { getClientSession } from './hooks/session';

/**
  Gets the current session. 
  Works server and client side. 
*/
export async function getSession() {
  if (!isServer) return await getClientSession();

  /* eslint-disable-next-line global-require */
  const { auth } = require('src/auth'); // Only import if running on server
  return await auth();
}

/**
  Adds Authorization header with the accessToken, and calls fetch.
  See fetch for call signature: https://developer.mozilla.org/fr/docs/Web/API/fetch
*/
export default async function authFetch(
  ...args: Parameters<typeof fetch>
): ReturnType<typeof fetch> {
  const session = await getSession();
  if (!session) return fetch(...args); // If no active session fetch, for use in unauthenticated routes

  const init = args[1] || {};
  init.headers = {
    ...{ Authorization: `Bearer ${session.accessToken}` },
    ...init.headers,
  };
  const newArgs: typeof args = [args[0], init];

  return fetch(...newArgs); // If there is an active session set Authorization and fetch
}
