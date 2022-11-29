'use client';

import { useEffect, ReactNode } from 'react';
import { Titillium_Web } from '@next/font/google';
import { useSetAtom } from 'jotai';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

import loginService from '@/services/login';
import { loginAtom } from '@/state/login';

import '@/styles/globals.scss';

function useLogin() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setLoginAtom = useSetAtom(loginAtom);

  useEffect(() => {
    const handleLoginChange = () => {
      if (loginService.isLogged) {
        setLoginAtom({
          accessToken: loginService.tokens?.access ?? '',
          idToken: loginService.tokens?.access ?? '',
          displayname: loginService.userInfo?.displayName ?? '',
          username: loginService.userInfo?.preferredUserName ?? '',
        });
      } else {
        setLoginAtom(null);
      }
    };

    loginService.initialize().then(handleLoginChange);
    return () => loginService.eventLogged.removeListener(handleLoginChange);
  }, [setLoginAtom]);

  useEffect(() => {
    if (pathname && Array.from(searchParams.keys()).includes('session_state')) {
      const nextSearchParams = new URLSearchParams(searchParams);

      nextSearchParams.delete('session_state');
      nextSearchParams.delete('code');

      const nextSearchParamsStr = nextSearchParams.toString();
      const href = pathname + (nextSearchParamsStr ? `?${nextSearchParamsStr}` : '');

      router.replace(href);
    }
  }, [pathname, router, searchParams]);
}

const titilliumWeb = Titillium_Web({
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-titillium-web',
});

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  useLogin();

  return (
    <html lang="en" className={`${titilliumWeb.variable} font-sans`}>
      <body>{children}</body>
    </html>
  );
}
