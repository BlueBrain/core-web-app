import { Suspense, ReactNode } from 'react';
import WrapperBanner from '@/components/WrapperBanner';
import { OBPLogo } from '@/components/Entrypoint/segments/Splash';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <WrapperBanner>
      <OBPLogo className="absolute left-10 top-10" color="text-white" />
      <div className="text-2xl font-bold text-white">
        <Suspense fallback="Logging in...">{children}</Suspense>
      </div>
    </WrapperBanner>
  );
}
