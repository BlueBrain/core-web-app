'use client';

import { signIn, signOut } from 'next-auth/react';

import Styles from './login-button.module.css';

export function SignInButton() {
  return (
    <button className={Styles.loginButton} type="button" onClick={() => signIn('keycloak')}>
      Log in
    </button>
  );
}

export function SignOutButton() {
  return (
    <button className={Styles.loginButton} type="button" onClick={() => signOut()}>
      Log out
    </button>
  );
}
