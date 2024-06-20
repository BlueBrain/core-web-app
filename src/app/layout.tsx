import { ReactNode, Suspense } from 'react';
import { Titillium_Web } from 'next/font/google';

import Providers from './providers';
import Feedback from '@/components/Feedback';
import '@/styles/globals.scss';
import { auth } from '@/auth';

const titilliumWeb = Titillium_Web({
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-titillium-web',
});

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await auth();
  return (
    <html lang="en" className={`${titilliumWeb.variable} font-sans`}>
      <body>
        <Providers session={session}>
          <Suspense fallback={null}>{children}</Suspense>
          <Feedback />
        </Providers>
      </body>
    </html>
  );
}
