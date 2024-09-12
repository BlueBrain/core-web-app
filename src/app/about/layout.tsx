'use client';

import { ReactNode } from 'react';

import { Gabarito } from 'next/font/google';

import LoginButton from '@/components/AboutSFN/Buttons/Login';
import { OBPLogo } from '@/components/Entrypoint/segments/Splash';
import { classNames } from '@/util/utils';

type Props = {
  children: ReactNode;
};

const gabarito = Gabarito({
  weight: ['600', '800'],
  subsets: ['latin'],
  variable: '--font-gabarito',
});

export default function AboutPageLayout({ children }: Props) {
  return (
    <div
      className={classNames(
        'relative flex min-h-screen flex-col gap-20 bg-primary-9 p-8 text-white',
        gabarito.className
      )}
    >
      <nav className="flex w-full justify-between">
        <OBPLogo color="text-white" />
        <LoginButton
          label="Log-in"
          link="/login"
          type="link"
          className="fixed right-12 top-12 z-[200]"
        />
      </nav>

      {children}
    </div>
  );
}
