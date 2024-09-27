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
        'relative flex min-h-screen flex-col bg-primary-9 text-white',
        gabarito.className
      )}
    >
      <nav className="fixed z-[200] flex w-full items-center justify-between px-6 py-6 md:px-12 md:py-8">
        <OBPLogo color="text-white" />
        <LoginButton label="Log in" link="/log-in" type="link" />
      </nav>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
