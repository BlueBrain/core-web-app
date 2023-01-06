'use client';

import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Create an absolute URL (string) of the current page using pathname and searchParams
 * from `next/navigation` component so that it's consistent with Next.js routing state.
 * This is used for sign-in to always redirect the user to the current page.
 *
 * See a comment below for more details about the issue.
 */
function useCallbackUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!pathname || typeof window === 'undefined') return undefined;

  const url = new URL(window.location.href);

  url.pathname = pathname;
  url.search = searchParams.toString();

  return url.toString();
}

export default function useEnsureLogin() {
  /*
    Window.location used by next-auth to create default callbackUrl points to a previous
    location while route change is pending, thus sign-in in some cases returns the user to a previous page.

    To ovecome that using next/navigation to create a callbackUrl.
  */
  const callbackUrl = useCallbackUrl();

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      signIn('keycloak', { callbackUrl });
    },
  });

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      // automatically re-login if refresh token expires
      signIn('keycloak', { callbackUrl });
    }
  }, [session, callbackUrl]);
}
