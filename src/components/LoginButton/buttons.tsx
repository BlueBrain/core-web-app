'use client';

import { signIn, signOut } from 'next-auth/react';
import { classNames } from '@/util/utils';

const buttonStyle =
  'text-blue-200 text-base font-medium grid place-items-center border-2 border-solid border-blue-400 w-40 h-12 mx-0 bg-transparent cursor-pointer transition-background duration-300 ease-linear';

export function SignInButton() {
  return (
    <button
      className={classNames(buttonStyle, 'mt-6')}
      type="button"
      onClick={() => signIn('keycloak')}
    >
      Login
    </button>
  );
}

export function SignOutButton() {
  return (
    <button className={classNames(buttonStyle, 'mt-2')} type="button" onClick={() => signOut()}>
      Logout
    </button>
  );
}
