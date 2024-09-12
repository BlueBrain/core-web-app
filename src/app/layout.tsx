import { Gabarito, Titillium_Web } from 'next/font/google';
import { ReactNode, Suspense } from 'react';
import Providers from './providers';

import { auth } from '@/auth';
import '@/styles/globals.scss';

const titilliumWeb = Titillium_Web({
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-titillium-web',
});

const gabarito = Gabarito({
  weight: ['400', '600', '800'],
  subsets: ['latin'],
  variable: '--font-gabarito',
});

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await auth();
  return (
    <html
      lang="en"
      className={`${titilliumWeb.variable} font-sans, ${gabarito.variable} font-geometric`}
    >
      <body>
        <Providers session={session}>
          <Suspense fallback={null}>{children}</Suspense>
          {/* <Feedback /> */}
        </Providers>
      </body>
    </html>
  );
}
