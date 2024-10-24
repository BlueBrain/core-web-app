'use client';

import { ReactNode } from 'react';
import { Alert } from 'antd';
import { useQueryState } from 'nuqs';

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
  const [warning, setWarning] = useQueryState('warning', {
    clearOnDefault: true,
    defaultValue: '',
  });
  return (
    <div
      className={classNames(
        'relative flex min-h-screen flex-col bg-primary-9 text-white',
        gabarito.className
      )}
    >
      {warning === 'yes' && (
        <Alert
          className="fixed left-0 top-0 z-[99999] h-28 w-full md:hidden"
          banner
          closable
          message={
            <div className="text-justify text-base font-light">
              You are currently using a mobile device. Some features are only available on the
              desktop version. Please switch to a desktop for a better experience!
            </div>
          }
          onClose={() => setWarning('')}
        />
      )}
      <nav
        className={classNames(
          'fixed z-[200] flex w-full items-center justify-between px-6 py-6 backdrop-blur md:px-12 md:py-8',
          warning === 'yes' ? 'top-28 md:top-0' : 'top-0'
        )}
      >
        <OBPLogo color="text-white" />
        <LoginButton label="Log in" link="/log-in" type="link" />
      </nav>
      <div className="relative">{children}</div>
    </div>
  );
}
