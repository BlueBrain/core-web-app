import * as React from 'react';
import type { AppProps } from 'next/app';
import '@/styles/globals.scss';
import { useSetAtom } from 'jotai';
import loginService from '@/services/login';
import { loginAtom } from '@/atoms/login';

function useLogin() {
  const setLoginAtom = useSetAtom(loginAtom);
  React.useEffect(() => {
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

export default function App({ Component, pageProps }: AppProps) {
  useLogin();
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...pageProps} />;
}
