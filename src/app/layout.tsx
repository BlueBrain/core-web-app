import { ReactNode } from 'react';
import { Titillium_Web } from 'next/font/google';
import Providers from './providers';
import Feedback from '@/components/Feedback';
import '@/styles/globals.scss';

const titilliumWeb = Titillium_Web({
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-titillium-web',
});

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${titilliumWeb.variable} font-sans`}>
      <body>
        <Providers>
          {children}
          <Feedback />
        </Providers>
      </body>
    </html>
  );
}
