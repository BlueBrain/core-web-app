import { getServerSession, type NextAuthOptions, type TokenSet } from 'next-auth';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';

import { env } from '@/env.mjs';

const issuer = env.KEYCLOAK_ISSUER;
const clientId = env.KEYCLOAK_CLIENT_ID;
const clientSecret = env.KEYCLOAK_CLIENT_SECRET;
const basePath = env.NEXT_PUBLIC_BASE_PATH;

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: TokenSet) {
  try {
    const tokenUrl = `${issuer}/protocol/openid-connect/token`;

    const response = await fetch(tokenUrl, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    // TODO: log to Sentry once it's enabled
    // eslint-disable-next-line no-console
    console.log(error);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    {
      clientId,
      id: 'keycloak',
      name: 'Keycloak',
      type: 'oauth',

      // next-auth package requires clientSecret because it supports only confidential clients,
      // while Keycloak SBO client is configured to be public and doesn't require it.
      clientSecret,

      wellKnown: `${issuer}/.well-known/openid-configuration`,
      authorization: {
        params: {
          scope: 'profile openid groups',
        },
      },
      idToken: true,
      checks: ['pkce', 'state'],
      profile(profile) {
        return {
          name: profile.name,
          email: profile.email,
          username: profile.preferred_username,
          id: profile.preferred_username,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : null,
          refreshToken: account.refresh_token,
          user,
          idToken: account.id_token,
        };
      }

      // Return previous token if the access token has not expired / is not close to expiration yet.
      if (
        typeof token.accessTokenExpires === 'number' &&
        Date.now() < token.accessTokenExpires - 2 * 60 * 1000
      ) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      return {
        user: {
          ...session.user,
          username: token.sub as string,
        },
        accessToken: token.accessToken as string,
        idToken: token.idToken,
        expires: new Date(token.accessTokenExpires as number).toISOString(),
        error: token.error as string,
      };
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: basePath + '/log-in', // eslint-disable-line
  },
} satisfies NextAuthOptions;

function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}

export { auth };
