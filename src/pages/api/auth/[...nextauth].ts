import NextAuth, { NextAuthOptions, TokenSet } from 'next-auth';

import { keycloak } from '@/config';

const { issuer, clientId, clientSecret } = keycloak;

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
      accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
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
      name: 'BBP Keycloak',
      type: 'oauth',

      // next-auth package requires clientSecret because it supports only confidential clients,
      // while Keycloak SBO client is configured to be public and doesn't require it.
      clientSecret,

      wellKnown: `${issuer}/.well-known/openid-configuration`,
      authorization: {
        params: {
          scope: 'profile openid nexus groups',
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
          accessTokenExpires: account.expires_at ? Date.now() + account.expires_at * 1000 : null,
          refreshToken: account.refresh_token,
          user,
        };
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
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
        expires: session.expires,
        error: token.error as string,
      };
    },
  },
};

export default NextAuth(authOptions);
