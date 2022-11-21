import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { Titillium_Web } from '@next/font/google';

import '@/styles/globals.scss';
import { useSetAtom } from 'jotai';
import loginService from '@/services/login';
import { loginAtom } from '@/atoms/login';

function useLogin() {
  const setLoginAtom = useSetAtom(loginAtom);
  useEffect(() => {
    setLoginAtom(null);
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
    loginService.eventLogged.addListener(handleLoginChange);
    return () => loginService.eventLogged.removeListener(handleLoginChange);
  }, [setLoginAtom]);
}

const titilliumWeb = Titillium_Web({
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-titillium-web',
});

export default function App({ Component, pageProps }: AppProps) {
  useLogin();

  return (
    <main className={`${titilliumWeb.variable} font-sans`}>
      <Component {...pageProps} /> {/* eslint-disable-line react/jsx-props-no-spreading */}
    </main>
  );
}
