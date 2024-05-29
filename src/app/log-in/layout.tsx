import { ReactNode } from 'react';

import WrapperBanner from '@/components/WrapperBanner';

export default function Layout({ children }: ReactNode) {
  return <WrapperBanner>{children}</WrapperBanner>;
}
