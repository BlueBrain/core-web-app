import { getSession } from '@/authFetch';
import { env } from '@/env.mjs';

export async function keycloakLogout() {
  const session = await getSession();
  const idToken = session?.idToken;
  if (!idToken) throw new Error("Couldn't locate id token");

  const params = new URLSearchParams({
    client_id: env.KEYCLOAK_CLIENT_ID,
    id_token_hint: idToken,
  });

  return fetch(`${env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout?${params.toString()}`);
}
